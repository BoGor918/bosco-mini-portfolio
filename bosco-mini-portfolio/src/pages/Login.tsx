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
// components
import PersonalIconComponent from '../components/icon/PersonalIconComponent';
// firebase
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { translationKeys } from '../globalVariable/Translation';
import { saveUserDocument } from '../query/UserQuery';

// form submit handler type
type SubmitHandler = {
    emailOrUsername: string;
    username: string;
    email: string;
    password: string;
};

// helper function to get user-friendly error messages based on Firebase error codes
function getFirebaseErrorMessage(code: string): string {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email format.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'This email is already in use.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return 'Authentication failed. Please try again.';
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
    const { t, theme, user, userData } = useContext(MapperContext);
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
    const secondaryButtonStyle = `rounded-md border` + (isDarkTheme ? ` border-white/30 text-white hover:bg-white/10` : ` border-[#0B1A33]/20 text-[#0B1A33] hover:bg-[#0B1A33]/5`);
    const messageStyle = `mt-4 w-full max-w-[331px] rounded-md px-4 py-2 text-sm` + (isDarkTheme ? ` bg-[#102340] text-white` : ` bg-slate-100 text-slate-700`);
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
                    showNotification('Please enter a valid email to create an account.', 'error');
                    setLoading(false);
                    return;
                }
                if (!signUpUsername) {
                    showNotification('Please enter a username.', 'error');
                    setLoading(false);
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, values.password);

                await saveUserDocument(userCredential.user.uid, {
                    Email: userCredential.user.email ?? signUpEmail,
                    Username: signUpUsername,
                    UID: userCredential.user.uid,
                });

                showNotification('Account created and logged in successfully.', 'success');
                navigate('/');
                return;
            }

            const inputValue = values.emailOrUsername.trim();
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

            if (!isEmail) {
                const userProfile = userData.find((profile) => profile.Username === inputValue);
                if (!userProfile || !userProfile.Email) {
                    showNotification('Invalid username or password.', 'error');
                    setLoading(false);
                    return;
                }
                emailFromUserProfile = userProfile.Email;
            }

            await signInWithEmailAndPassword(auth, emailFromUserProfile ?? inputValue, values.password);
            showNotification('Logged in successfully.', 'success');

            navigate('/dashboard');
        } catch (error: any) {
            const notificationMessage = getFirebaseErrorMessage(error?.code)
            showNotification(notificationMessage, 'error');
        } finally {
            form.setFieldValue('password', '');
            setLoading(false);
        }
    };

    // sign out handler
    const onSignOut = async () => {
        setLoading(true);

        try {
            await signOut(auth);
            form.setValues({ emailOrUsername: '', username: '', email: '', password: '' });
            showNotification('You are now logged out.', 'success');
        } catch {
            showNotification('Could not log out. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={loginContainerStyle}>
            {/* personal icon */}
            <PersonalIconComponent />
            {user ? (
                <div className={formStyle}>
                    <div className={messageStyle}>
                        Signed in as {user.email}
                    </div>
                    <Group justify="flex-end" mt="md">
                        <Button type="button" className={secondaryButtonStyle} onClick={() => navigate('/')}>
                            Go Home
                        </Button>
                        <Button type="button" className={submitButtonStyle} onClick={onSignOut} loading={loading}>
                            Sign Out
                        </Button>
                    </Group>
                </div>
            ) : (
                <>
                    {/* form */}
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
                </>
            )}
        </div>
    )
}
