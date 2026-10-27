// The developer docs sign-in page (overrides/login.html). The gated docs host sends people back here with
// ?error=not_approved or ?error=callback when sign-in fails, and with ?returnTo= when they asked for a docs page first.
(function () {
  var button = document.querySelector('[data-login-button]')
  if (!button) return

  var ERROR_MESSAGES = {
    not_approved: {
      title: 'This Google account isn’t approved',
      text: 'Access to the developer docs is by invitation. If you were invited, accept the invitation in the ' +
        'Open AGI Stack Semantic portal first, then sign in here with the same Google account. Otherwise ask your ' +
        'organization’s administrator to invite your email address — or use a different Google account.',
    },
    callback: { text: 'Sign-in didn’t complete. Please try again.' },
  }

  // Only same-site paths on the docs host, to avoid open redirects ("//evil.com", "/\evil.com"); auth/ checks again
  function safeReturnTo(value) {
    return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')
      ? value
      : '/'
  }

  var params = new URLSearchParams(window.location.search)
  var error = params.get('error')
  // Unknown codes fall back to the generic message
  var message = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.callback : null
  var notApproved = error === 'not_approved'

  var query = new URLSearchParams({ returnTo: safeReturnTo(params.get('returnTo')) })
  // After a refusal, let them pick another Google account instead of signing straight back in with the same one
  if (notApproved) query.set('switch', '1')
  button.href = button.getAttribute('data-docs-host') + '/auth/login?' + query
  if (notApproved) button.querySelector('span').textContent = 'Use a different Google account'

  if (message) {
    var box = document.querySelector('[data-login-error]')
    var title = box.querySelector('[data-login-error-title]')
    box.querySelector('[data-login-error-text]').textContent = message.text
    if (message.title) {
      title.textContent = message.title
      title.hidden = false
      box.classList.add('sign__error--box')
    }
    box.hidden = false
  }
})()
