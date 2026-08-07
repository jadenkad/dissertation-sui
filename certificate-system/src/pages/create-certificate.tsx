import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import '../App.css';
import { CONFIG } from '../config';

export default function CreateCertificate() {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    
    const [studentAddress, setStudentAddress] = useState('');
    const [name, setName] = useState('');
    const [uniName, setUniName] = useState('');
    const [qualification, setQualification] = useState('');
    const [grade, setGrade] = useState('');

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleClear = () => {
        setStudentAddress('');
        setName('');
        setUniName('');
        setQualification('');
        setGrade('');
        setStatus('idle');
        setMessage('');
    };

    const isValidSuiObjectId = (id: string): boolean => {
        const cleanId = id.startsWith('0x') ? id.slice(2) : id;
        const hexRegex = /^[0-9a-fA-F]{64}$/;
        return hexRegex.test(cleanId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        setMessage("Checking institution credentials...");

        if (!account) {
            setStatus('error');
            setMessage("Please connect your wallet first!");
            return;
        }

        if (!isValidSuiObjectId(studentAddress.trim())) {
            setStatus('error');
            setMessage("Invalid Student Address format.");
            return;
        }

        try {
            const objects = await client.getOwnedObjects({
                owner: account.address,
                filter: { StructType: CONFIG.INST_TYPE }
            });

            if (objects.data.length === 0) {
                setStatus('error');
                setMessage("Access Denied: You do not own an InstitutionCap for this contract.");
                return;
            }

            const foundCapId = objects.data[0].data?.objectId;
            if (!foundCapId) throw new Error("Could not retrieve Cap ID.");

            const tx = new Transaction();
            tx.moveCall({
                target: CONFIG.CERT_FUNCTION,
                arguments: [
                    tx.object(foundCapId),
                    tx.pure.address(studentAddress.trim()),
                    tx.pure.string(name),
                    tx.pure.string(qualification),
                    tx.pure.string(grade),
                    tx.pure.string(uniName)
                ]
            });

            setMessage("Requesting signature...");
            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        setStatus('success');
                        setMessage("Certificate issued successfully!");
                        console.log("Digest:", result.digest);
                    },
                    onError: (error) => {
                        setStatus('error');
                        setMessage(error.message || "Transaction failed.");
                    },
                }
            );

        } catch (err) {
            console.error("Issuance error:", err);
            setStatus('error');
            setMessage("Internal Error: Failed to verify permissions.");
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Issue Certificate</h1>
            <p className="page-subtitle">Enter and Submit the Input Fields Below to Create and Transfer a Certificate Object to a Student Wallet. A User's Own Wallet Address Can Be Found in the Sui Wallet Browser Extension.</p>

            <form className={`card ${status === 'error' ? 'error' : ''} ${status === 'success' ? 'success' : ''}`} onSubmit={handleSubmit}>
                {status !== 'idle' && (
                    <p className={`status-msg ${status}`}>{message}</p>
                )}
                
                <div className="form-group">
                    <label className="label">Student Wallet Address (64 Digit Hexadecimal)</label>
                    <input 
                        className="input" 
                        value={studentAddress} 
                        onChange={(e) => setStudentAddress(e.target.value)} 
                        required
                        placeholder="e.g., 0x28be...3c45"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Student Full Name</label>
                    <input 
                        className="input" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        placeholder="e.g., John Smith"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Name of Academic Institution</label>
                    <input 
                        className="input" 
                        value={uniName} 
                        onChange={(e) => setUniName(e.target.value)} 
                        required
                        placeholder="e.g., University of Sheffield" 
                    />
                </div>

                <div className="form-group">
                    <label className="label">Qualification Achieved / Course Name</label>
                    <input 
                        className="input" 
                        value={qualification} 
                        onChange={(e) => setQualification(e.target.value)} 
                        required 
                        placeholder="e.g., Computer Science Bsc"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Grade Achieved</label>
                    <input 
                        className="input" 
                        value={grade} 
                        onChange={(e) => setGrade(e.target.value)} 
                        required 
                        placeholder="e.g., First Class Honours"
                    />
                </div>

                <div className="btn-group">
                    <button type="submit" className="btn primary">Issue Certificate</button>
                    <button type="button" onClick={handleClear} className="btn secondary">Clear</button>
                </div>
            </form>
        </div>
    );
}