const handleAuth = async (type) => {
  // Set only the relevant loading state
  if (type === 'login') {
    setIsLoggingIn(true);
  } else {
    setIsRegistering(true);
  }
  setMessage('');

  // Validate email and password
  if (!validateInput()) {
    setIsLoggingIn(false);
    setIsRegistering(false);
    return;
  }

  const endpoint = type === 'login' ? '/api/sign-in.php' : '/api/register.php';
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (type === 'login') {
        setMessage('Login successful!');

        // Save user data to localStorage
        localStorage.setItem('token', data.token || '');
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.id,
            fName: data.fName,
            lName: data.lName,
            email: data.email,
            profile_picture: data.profile_picture,
          })
        );

        navigate('/home');
      } else {
        setMessage('Registration successful! Please log in.');
      }
    } else {
      setMessage(data.message || 'Something went wrong.');
    }
  } catch (error) {
    setMessage(`Network error: ${error.message}`);
  } finally {
    // Reset only the relevant loading state
    if (type === 'login') {
      setIsLoggingIn(false);
    } else {
      setIsRegistering(false);
    }
  }
};