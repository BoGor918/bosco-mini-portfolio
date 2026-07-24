// react
import { useContext, useMemo, useState } from 'react';
// mantine
import { Button, PasswordInput, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// navigate
import { useNavigate } from 'react-router-dom';
// global variable
import { colorTheme } from '../globalVariable/GlobalVariable';
import { MapperContext } from '../globalVariable/MapperContextProvider';
import { showNotification } from '../globalVariable/Notification';
import { translationKeys } from '../globalVariable/Translation';
// components
import PersonalIconComponent from '../components/icon/PersonalIconComponent';
// firebase
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
// query
import { saveUserDocument } from '../query/UserQuery';

// form submit handler type
type SubmitHandler = {
    emailOrUsername: string;
    username: string;
    email: string;
    password: string;
};

// helper function to get user-friendly error messages based on Firebase error codes
function getFirebaseErrorMessage(code: string, t: (key: keyof typeof translationKeys) => string): string {
    switch (code) {
        case 'auth/invalid-email':
            return t(translationKeys.authInvalidEmailFormat);
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return t(translationKeys.authInvalidEmailOrPassword);
        case 'auth/email-already-in-use':
            return t(translationKeys.authEmailAlreadyInUse);
        case 'auth/weak-password':
            return t(translationKeys.authWeakPassword);
        case 'auth/too-many-requests':
            return t(translationKeys.authTooManyRequests);
        default:
            return t(translationKeys.authFailed);
    }
}

export default function Login() {
    // form
    const form = useForm<SubmitHandler>({
        mode: 'uncontrolled',
        initialValues: {
            emailOrUsername: '',
            username: '',
            email: '',
            password: '',
        },
    });
    // context
    const { t, theme, userData } = useContext(MapperContext);
    // state
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    // color theme
    const isDarkTheme = theme === colorTheme.dark;
    const modeText = useMemo(() => (isSignUp ? t(translationKeys.createAnAccount) : t(translationKeys.signIn)), [isSignUp, t]);
    // navigate
    const navigate = useNavigate();

    // style list
    const loginContainerStyle = `flex flex-col justify-center items-center my-auto w-full h-screen`;
    const formStyle = `mt-6 w-full max-w-[365px] px-4`;
    const submitButtonStyle = `text-[#FFFFFF] rounded-md` + (theme === colorTheme.dark ? ` bg-[#4094F4] hover:bg-[#4094F4]/90` : ` bg-[#0B1A33] hover:bg-[#0B1A33]/90`);
    const inputStyles = {
        label: {
            color: isDarkTheme ? '#FFFFFF' : '#334155',
            fontWeight: 600,
            fontSize: '14px',
        },
        input: {
            backgroundColor: isDarkTheme ? '#102340' : '#FFFFFF',
            color: isDarkTheme ? '#FFFFFF' : '#0B1A33',
            borderColor: isDarkTheme ? 'rgba(33, 212, 247, 0.45)' : 'rgba(11, 26, 51, 0.25)',
            fontSize: '14px',
        },
    };

    // submit handler
    const onSubmit = async (values: SubmitHandler) => {
        let emailFromUserProfile;
        setLoading(true);
        try {
            if (isSignUp) {
                const signUpUsername = values.username.trim();
                const signUpEmail = values.email.trim();
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpEmail);

                if (!isEmail) {
                    showNotification(t(translationKeys.authValidEmailRequired), 'error');
                    setLoading(false);
                    return;
                }
                if (!signUpUsername) {
                    showNotification(t(translationKeys.authUsernameRequired), 'error');
                    setLoading(false);
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, values.password);

                await saveUserDocument(userCredential.user.uid, {
                    Email: userCredential.user.email ?? signUpEmail,
                    Username: signUpUsername,
                    UID: userCredential.user.uid,
                    IsAdmin: false,
                });

                showNotification(t(translationKeys.authAccountCreatedSuccess), 'success');
                navigate('/');
                return;
            }

            const inputValue = values.emailOrUsername.trim();
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

            if (!isEmail) {
                const userProfile = userData.find((profile) => profile.Username === inputValue);
                if (!userProfile || !userProfile.Email) {
                    showNotification(t(translationKeys.authInvalidUsernameOrPassword), 'error');
                    setLoading(false);
                    return;
                }
                emailFromUserProfile = userProfile.Email;
            }

            await signInWithEmailAndPassword(auth, emailFromUserProfile ?? inputValue, values.password);
            showNotification(t(translationKeys.authLoggedInSuccess), 'success');

            navigate('/dashboard');
        } catch (error: any) {
            const notificationMessage = getFirebaseErrorMessage(error?.code, t)
            showNotification(notificationMessage, 'error');
        } finally {
            form.setFieldValue('password', '');
            setLoading(false);
        }
    };

    return (
        <div className={loginContainerStyle}>
            {/* personal icon */}
            <PersonalIconComponent />
            <form className={formStyle} onSubmit={form.onSubmit((values) => onSubmit(values))}>
                {isSignUp ? (
                    <>
                        <TextInput
                            className="w-full"
                            withAsterisk
                            label={t(translationKeys.email)}
                            key={form.key('email')}
                            styles={inputStyles}
                            {...form.getInputProps('email')}
                        />
                        <TextInput
                            className="w-full pt-2"
                            withAsterisk
                            label={t(translationKeys.username)}
                            key={form.key('username')}
                            styles={inputStyles}
                            {...form.getInputProps('username')}
                        />
                    </>
                ) : (
                    <TextInput
                        className="w-full"
                        withAsterisk
                        label={t(translationKeys.emailOrUsername)}
                        key={form.key('emailOrUsername')}
                        styles={inputStyles}
                        {...form.getInputProps('emailOrUsername')}
                    />
                )}
                <PasswordInput
                    className="w-full pt-2"
                    withAsterisk
                    label={t(translationKeys.password)}
                    key={form.key('password')}
                    styles={inputStyles}
                    {...form.getInputProps('password')}
                />
                <Group justify="space-between" mt="md">
                    <div
                        className={`text-sm cursor-pointer ${isDarkTheme ? 'text-white hover:underline' : 'text-[#0B1A33] hover:underline'}`}
                        onClick={() => {
                            setIsSignUp((value) => !value);
                        }}
                    >
                        {isSignUp ? t(translationKeys.alreadyHaveAnAccount) : t(translationKeys.createAnAccount)}
                    </div>
                    <Button type="submit" className={submitButtonStyle} loading={loading}>
                        {modeText}
                    </Button>
                </Group>
            </form>
        </div>
    )
}
