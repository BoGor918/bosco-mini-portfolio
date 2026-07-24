// react
import { useContext, useEffect, useMemo, useState } from 'react';
// mantine
import { Button, PasswordInput, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
// icon
import { BiMoon, BiSolidMoon } from 'react-icons/bi';
// navigate
import { useNavigate } from 'react-router-dom';
// global variable
import { colorTheme } from '../globalVariable/GlobalVariable';
import { MapperContext } from '../globalVariable/MapperContextProvider';
import { showNotification } from '../globalVariable/Notification';
import { languageSetting, translationKeys } from '../globalVariable/Translation';
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
    const { t, theme, language, setLanguage, setTheme, userData, loadUserData } = useContext(MapperContext);
    // state
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    // mode text
    const modeText = useMemo(() => (isSignUp ? t(translationKeys.createAnAccount) : t(translationKeys.signIn)), [isSignUp, t]);
    // navigate
    const navigate = useNavigate();

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // style list
    const loginContainerStyle = `flex flex-col justify-center items-center my-auto w-full h-screen`;
    const formStyle = `w-full max-w-[365px] px-4 animate-fade-up animate-delay-200 animate-once`;
    const submitButtonStyle = `text-[#FFFFFF] rounded-md` + (theme === colorTheme.dark ? ` bg-[#4094F4] hover:bg-[#4094F4]/90` : ` bg-[#0B1A33] hover:bg-[#0B1A33]/90`);
    const languageSwitchAndThemeContainerStyle = `w-full max-w-[365px] px-4 flex flex-wrap items-center gap-2 justify-center mt-5 mb-3 animate-fade-up animate-delay-100 animate-once`;
    const languageSwitchContainerStyle = `flex items-center gap-2`;
    const languageSwitchButtonStyle = (isActive: boolean) =>
        `px-2 py-1 border rounded-md text-[11px] font-semibold transition ` + (theme === colorTheme.dark
            ? isActive
                ? `border-[#21D4F7] bg-[#21D4F7] text-[#0B1A33]`
                : `border-white/45 text-white hover:bg-white/10`
            : isActive
                ? `border-[#0B1A33] bg-[#0B1A33] text-white`
                : `border-[#0B1A33]/45 text-[#0B1A33] hover:bg-[#0B1A33]/10`);
    const themeSwitchButtonStyle = `p-1 border-[2px] rounded-full` + (theme !== colorTheme.dark ? ` border-[#0B1A33] hover:bg-[#0B1A33]/10` : ` border-[#FFFFFF] hover:bg-[#FFFFFF]/10`);
    const biMoonIconStyle = `text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const biSolidMoonIconStyle = `text-[#FFFFFF] text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const backtoHomeTextStyle = `font-bold text-sm cursor-pointer` + (theme === colorTheme.dark ? ` text-white hover:underline` : ` text-[#0B1A33] hover:underline`);
    const inputStyles = {
        label: {
            color: theme === colorTheme.dark ? '#FFFFFF' : '#334155',
            fontWeight: 600,
            fontSize: '14px',
        },
        input: {
            backgroundColor: theme === colorTheme.dark ? '#102340' : '#FFFFFF',
            color: theme === colorTheme.dark ? '#FFFFFF' : '#0B1A33',
            borderColor: theme === colorTheme.dark ? 'rgba(33, 212, 247, 0.45)' : 'rgba(11, 26, 51, 0.25)',
            fontSize: '14px',
        },
    };
    const createAccountTextStyle = `text-sm cursor-pointer` + (theme === colorTheme.dark ? ` text-white hover:underline` : ` text-[#0B1A33] hover:underline`);

    const handleThemeSwitch = () => {
        setTheme(theme === colorTheme.dark ? colorTheme.light : colorTheme.dark);
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
            {/* language and theme group */}
            <div className={languageSwitchAndThemeContainerStyle}>
                <div className={languageSwitchContainerStyle}>
                    <button
                        type="button"
                        onClick={() => setLanguage(languageSetting.english)}
                        className={languageSwitchButtonStyle(language === languageSetting.english)}
                    >
                        {t(translationKeys.englishLanguage)}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage(languageSetting.traditionalChinese)}
                        className={languageSwitchButtonStyle(language === languageSetting.traditionalChinese)}
                    >
                        {t(translationKeys.tranditionalChineseLanguage)}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage(languageSetting.simplifiedChinese)}
                        className={languageSwitchButtonStyle(language === languageSetting.simplifiedChinese)}
                    >
                        {t(translationKeys.simplifiedChineseLanguage)}
                    </button>
                </div>
                <button type="button" onClick={handleThemeSwitch} className={themeSwitchButtonStyle}>
                    {
                        theme === colorTheme.light
                            ? <BiMoon className={biMoonIconStyle} />
                            : <BiSolidMoon className={biSolidMoonIconStyle} />
                    }
                </button>
                {/* login and dashboard link */}
                <button
                    type="button"
                    className={backtoHomeTextStyle}
                    onClick={() => {
                        navigate('/');
                    }}
                    aria-label={t(translationKeys.backToHome)}
                >
                    {t(translationKeys.backToHome)}
                </button>
            </div>
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
                    <button
                        type="button"
                        className={createAccountTextStyle}
                        onClick={() => {
                            setIsSignUp((value) => !value);
                        }}
                        aria-label={isSignUp ? t(translationKeys.alreadyHaveAnAccount) : t(translationKeys.createAnAccount)}
                    >
                        {isSignUp ? t(translationKeys.alreadyHaveAnAccount) : t(translationKeys.createAnAccount)}
                    </button>
                    <Button type="submit" className={submitButtonStyle} loading={loading}>
                        {modeText}
                    </Button>
                </Group>
            </form>
        </div>
    )
}
