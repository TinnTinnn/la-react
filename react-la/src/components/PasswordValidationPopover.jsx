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

    return (
        <div className="absolute left-full ml-2 top-[1.75rem] p-3 bg-white border rounded-lg shadow-lg z-50 w-64">
            <div className="absolute left-0 top-[0.875rem] -translate-y-1/2 -ml-2 w-0 h-0
            border-t-[6px] border-t-transparent
            border-r-[8px] border-r-white
            border-b-[6px] border-b-transparent
            drop-shadow-[-2px_0_2px_rgba(0,0,0,0.1)]
            ">
            </div>
            <p className="font-semibold mb-2">Password must contain:</p>
            <ul className="space-y-1">
                <li className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-red-500'}`}>
                    {validations.length ? '✓' : '✗'} At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-red-500'}`}>
                    {validations.uppercase ? '✓' : '✗'} 1 uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-red-500'}`}>
                    {validations.lowercase ? '✓' : '✗'} 1 lowercase letter
                </li>
                <li className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-red-500'}`}>
                    {validations.number ? '✓' : '✗'} 1 number
                </li>
                <li className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-red-500'}`}>
                    {validations.special ? '✓' : '✗'} 1 special character
                </li>
            </ul>
        </div>
    )
}