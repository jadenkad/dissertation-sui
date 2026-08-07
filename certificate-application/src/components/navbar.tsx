import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import '../App.css';
import { CONFIG } from '../config';

export default function Navbar() {
    const account = useCurrentAccount();
    const client = useSuiClient();
    const navigate = useNavigate();
    const location = useLocation();

    const [isInst, setIsInst] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const protectedRoutes = ['/create-certificate', '/create-institution', '/portfolio'];
        if (!account && protectedRoutes.includes(location.pathname)) {
            navigate('/verify');
        }

        const checkPermissions = async () => {
            if (!account?.address) {
                setIsInst(false);
                setIsAdmin(false);
                return;
            }

            setLoading(true);
            try {
                // Check for Institution Capability
                const responseInst = await client.getOwnedObjects({
                    owner: account.address,
                    filter: { StructType: CONFIG.INST_TYPE },
                });

                // Check for Admin Capability
                const responseAdmin = await client.getOwnedObjects({
                    owner: account.address,
                    filter: { StructType: CONFIG.ADMIN_TYPE },
                });

                setIsInst(responseInst.data.length > 0);
                setIsAdmin(responseAdmin.data.length > 0);

            } catch (error) {
                console.error("Permission check failed:", error);
                setIsInst(false);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkPermissions();
    }, [account, client, navigate, location.pathname]);

    return (
        <nav className="navbar">
            <div> 
                <Link to="/verify" className="nav-link"> Verify Certificate </Link> 
            </div>
            
            {isInst && (
                <div> 
                    <Link to="/create-certificate" className="nav-link"> Issue Certificate </Link> 
                </div> 
            )}

            {isAdmin && (
                <div> 
                    <Link to="/create-institution" className="nav-link"> Create Institution </Link> 
                </div>
            )} 

            {account && (
                <div> 
                    <Link to="/portfolio" className="nav-link"> Portfolio </Link> 
                </div>
            )}
            
            <ConnectButton />
        </nav>
    );
}