import { useState } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import '../App.css';
import { CONFIG } from '../config';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export default function Verify(){
    const [id, setId] = useState('');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const check = async () => {
        setData(null);
        setError(null);

        try {
            const res = await client.getObject({
                id: id.trim(),
                options: { 
                    showContent: true, 
                    showType: true,
                    showOwner: true 
                } 
            });

            const objType = res.data?.type;
            const expectedType = CONFIG.CERT_TYPE;

            if (objType === expectedType) {
                if (res.data?.content && 'fields' in res.data.content) {
                    const rawOwner = res.data.owner;
                    const ownerAddress = (rawOwner && typeof rawOwner === 'object' && 'AddressOwner' in rawOwner) 
                        ? rawOwner.AddressOwner 
                        : "Unknown";

                    setData({
                        ...res.data.content.fields,
                        owner: ownerAddress
                    });
                }
            } else {
                setError("This object IS NOT a valid Certificate.");
            }
        } catch (e) {
            setError("Object NOT FOUND. Check your Object ID.");
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Certificate Verification</h1>
            <p className="page-subtitle">To Verify a Certificate, Please Enter the Certificate's Object ID. 
                                        This can be Found in a Student's Portfolio When Viewing a Certificate.
            </p>
            <div className="card">
                <div className="form-group">
                    <label className="label">Certificate Object ID (64 Digit Hexadecimal)</label>
                    <input 
                        className="input"
                        value={id} 
                        onChange={e => setId(e.target.value)} 
                        placeholder="e.g., 0x28be...3c45" 
                    />
                </div>
                <button className="btn full-width" onClick={check}>
                    Verify
                </button>
            </div>

            {error &&(
                <div className="card error">
                    <h2 className="card-title" style={{ color: 'var(--error)' }}>Verification Failed</h2>
                    <p className="status-msg error">{error}</p>
                </div>
            )}

            {data && (
                <div className="card">
                    <h2 className="card-title">Verified Certificate</h2>
                    
                    <div className="data-row">
                        <span className="data-label">NAME:</span>
                        <span className="data-value">{data.name}</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">QUALIFICATION:</span>
                        <span className="data-value">{data.qualification}</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">GRADE:</span>
                        <span className="data-value">{data.grade}</span>
                    </div>
                    <div className="data-row"> 
                        <span className="data-label">UNIVERSITY:</span>
                        <span className="data-value">{data.university}</span>
                    </div>
                    
                    <div className="footer-info">
                        <strong>OWNER ID:</strong><br /> 
                        {data.owner}
                    </div>
                    <div className="footer-info">
                        <strong>ISSUER ID:</strong><br /> 
                        {data.issued_by}
                    </div>
                </div>
            )}
        </div>
    );
}