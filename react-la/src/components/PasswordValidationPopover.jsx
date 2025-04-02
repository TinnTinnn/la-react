import {useEffect, useState} from "react";


export default function PasswordValidationPopover({password}) {
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        })
    }, [password]);

    // สร้าง style object สำหรับ Mantine เพื่อป้องกันการขัดแย้งกับ Mantine styles
    const popoverStyles = {
        position: 'absolute',
        zIndex: 1000,
        left: 'calc(100% + 8px)',  // ปรับตำแหน่งให้ห่างจากช่อง input
        top: '0',
        padding: '12px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '260px',
    };

    const arrowStyles = {
        position: 'absolute',
        left: '-8px',
        top: '16px',
        width: '0',
        height: '0',
        borderTop: '6px solid transparent',
        borderRight: '8px solid white',
        borderBottom: '6px solid transparent',
        filter: 'drop-shadow(-2px 0 2px rgba(0,0,0,0.1))'
    };

    const successStyle = {
        color: '#16a34a' // เทียบเท่ากับ text-green-600
    };

    const errorStyle = {
        color: '#ef4444' // เทียบเท่ากับ text-red-500
    };

    const listItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px'
    };

    return (
        <div style={popoverStyles}>
            <div style={arrowStyles}></div>
            <p style={{fontWeight: 600, marginBottom: '8px'}}>Password must contain:</p>
            <ul>
                <li style={{...listItemStyle, ...(validations.length ? successStyle : errorStyle)}}>
                    {validations.length ? '✓' : '✗'} At least 8 characters
                </li>
                <li style={{...listItemStyle, ...(validations.uppercase ? successStyle : errorStyle)}}>
                    {validations.uppercase ? '✓' : '✗'} 1 uppercase letter
                </li>
                <li style={{...listItemStyle, ...(validations.lowercase ? successStyle : errorStyle)}}>
                    {validations.lowercase ? '✓' : '✗'} 1 lowercase letter
                </li>
                <li style={{...listItemStyle, ...(validations.number ? successStyle : errorStyle)}}>
                    {validations.number ? '✓' : '✗'} 1 number
                </li>
                <li style={{...listItemStyle, ...(validations.special ? successStyle : errorStyle)}}>
                    {validations.special ? '✓' : '✗'} 1 special character
                </li>
            </ul>
        </div>
    )
}