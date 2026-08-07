import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import '../App.css';
import { CONFIG } from '../config';

export default function CreateInstitution() {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();

    const [instAddress, setInstAddress] = useState('');
    const [instName, setInstName] = useState('');
    const [locationAddress, setLocationAddress] = useState('');
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleClear = () => {
        setInstAddress('');
        setInstName('');
        setLocationAddress('');
        setUrl('');
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
        setMessage("Verifying Admin permissions...");

        if (!account) {
            setStatus('error');
            setMessage("Please connect your wallet first!");
            return;
        }

        if (!isValidSuiObjectId(instAddress.trim())) {
            setStatus('error');
            setMessage("Invalid Institution Address. Must be 64-char hex.");
            return;
        }

        try {
            const objects = await client.getOwnedObjects({
                owner: account.address,
                filter: { StructType: CONFIG.ADMIN_TYPE }
            });

            if (objects.data.length === 0) {
                setStatus('error');
                setMessage("Access Denied: AdminCap not found in this wallet.");
                return;
            }

            const foundAdminCapId = objects.data[0].data?.objectId;

            if (!foundAdminCapId) {
                throw new Error("Found AdminCap but could not read its ID.");
            }

            const tx = new Transaction();
            tx.moveCall({
                target: CONFIG.ADMIN_FUNCTION,
                arguments: [
                    tx.object(foundAdminCapId),
                    tx.object(CONFIG.REGISTRY),
                    tx.pure.address(instAddress.trim()),
                    tx.pure.string(instName),
                    tx.pure.string(locationAddress),
                    tx.pure.string(url),
                ]
            });

            setMessage("Requesting wallet signature...");
            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result) => {
                        setStatus('success');
                        setMessage("Institution Created Successfully!");
                        console.log("Digest:", result.digest);
                    },
                    onError: (error) => {
                        setStatus('error');
                        setMessage(error.message || "Transaction failed.");
                    },
                }
            );

        } catch (err) {
            console.error("Verification Error:", err);
            setStatus('error');
            setMessage("Internal Error: Could not verify ownership.");
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Create Institution</h1>
            <p className="page-subtitle">Enter and Submit the Input Fields Below to Grant Institution Capabilities to a Wallet. A User's Own Wallet Address Can Be Found in the Sui Wallet Browser Extension.</p>

            <form className={`card ${status === 'error' ? 'error' : ''} ${status === 'success' ? 'success' : ''}`} onSubmit={handleSubmit}>
                {status !== 'idle' && (
                    <p className={`status-msg ${status}`}>{message}</p>
                )}
                
                <div className="form-group">
                    <label className="label">Institution Wallet Address (64 Digit Hexadecimal)</label>
                    <input 
                        className="input" 
                        value={instAddress} 
                        onChange={(e) => setInstAddress(e.target.value)} 
                        required 
                        placeholder="e.g., 0x28be...3c45"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Institution Full Name</label>
                    <input 
                        className="input" 
                        value={instName} 
                        onChange={(e) => setInstName(e.target.value)} 
                        required 
                        placeholder="e.g., University of Sheffield"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Academic Institution Location Address</label>
                    <input 
                        className="input" 
                        value={locationAddress} 
                        onChange={(e) => setLocationAddress(e.target.value)} 
                        required 
                        placeholder="e.g., 123 Sheffield Road, Sheffield, South Yorkshire, England"
                    />
                </div>

                <div className="form-group">
                    <label className="label">Institution URL</label>
                    <input 
                        className="input" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        required 
                        placeholder="e.g. https://sheffield.ac.uk/"
                    />
                </div>

                <div className="btn-group">
                    <button type="submit" className="btn primary">Create Institution</button>
                    <button type="button" onClick={handleClear} className="btn secondary">Clear</button>
                </div>
            </form>
        </div>
    );
}