import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import '../App.css';
import { CONFIG } from '../config';

export default function Portfolio() {
    const client = useSuiClient();
    const account = useCurrentAccount();

    const [systemObjects, setSystemObjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (account?.address) fetchPortfolio();
    }, [account?.address]);

    const fetchPortfolio = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await client.getOwnedObjects({
                owner: account!.address,
                filter: { Package: CONFIG.PACKAGE_ID },
                options: { 
                    showContent: true, 
                    showType: true,
                    showOwner: true 
                }
            });
            setSystemObjects(response.data);
        } catch (err) {
            setError("Failed to load portfolio items.");
        } finally {
            setLoading(false);
        }
    };

    const formatLabel = (label: string) => {
        return label.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="page-container">
            <h1 className="page-title">My Portfolio</h1>
            <p className="page-subtitle">All System Objects Owned By Your Wallet Are Displayed Below. Students Can View Their Certificates Here.</p>

            {!account ? (
                <div className="card error">
                    <p className="status-msg error">Please connect your wallet first.</p>
                </div>
            ) : loading ? (
                <div className="card">
                    <p className="status-msg neutral">Scanning blockchain...</p>
                </div>
            ) : systemObjects.length === 0 ? (
                <div className="card">
                    <p className="status-msg neutral">No system objects found in this wallet.</p>
                </div>
            ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {systemObjects.map((obj) => {
                        const fields = (obj.data.content as any)?.fields || {};
                        const isCertificate = obj.data.type === CONFIG.CERT_TYPE;
                        const typeName = obj.data.type.split('::').pop();

                        if (isCertificate) {
                            return (
                                <div key={obj.data.objectId} className="card">
                                    <h2 className="card-title">Verified Certificate</h2>
                                    
                                    <div className="data-row">
                                        <span className="data-label">NAME:</span>
                                        <span className="data-value">{fields.name}</span>
                                    </div>
                                    <div className="data-row">
                                        <span className="data-label">QUALIFICATION:</span>
                                        <span className="data-value">{fields.qualification}</span>
                                    </div>
                                    <div className="data-row">
                                        <span className="data-label">GRADE:</span>
                                        <span className="data-value">{fields.grade}</span>
                                    </div>
                                    <div className="data-row"> 
                                        <span className="data-label">UNIVERSITY:</span>
                                        <span className="data-value">{fields.uni_name || fields.university}</span>
                                    </div>
                                    
                                    <div className="footer-info">
                                        <strong>OBJECT ID:</strong><br /> 
                                        {obj.data.objectId}
                                    </div>
                                    <div className="footer-info">
                                        <strong>ISSUER ID:</strong><br /> 
                                        {fields.issued_by || "System Admin"}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={obj.data.objectId} className="card">
                                <h2 className="card-title">{formatLabel(typeName || 'System Object')}</h2>

                                <div className="footer-info">
                                    <strong>OBJECT ID:</strong><br /> 
                                    {obj.data.objectId}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <button 
                className="btn" 
                onClick={fetchPortfolio} 
                disabled={!account || loading}
                style={{ marginTop: '20px' }}
            >
                {loading ? 'Refreshing...' : 'Refresh Portfolio'}
            </button>
        </div>
    );
}