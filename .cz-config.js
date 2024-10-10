module.exports = {
  // Set the types of commits that will appear in the prompt
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'style', name: 'style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests or correcting existing tests' },
    { value: 'chore', name: 'chore:    Changes to the build process or auxiliary tools and libraries such as documentation generation' },
    { value: 'revert', name: 'revert:   Revert to a commit' },
  ],

  // Optional, if you want to specify the messages for specific fields
  messages: {
    type: 'Select the type of change that you\'re committing:',
    customScope: 'Enter a custom scope (optional):',
    subject: 'Write a short, imperative tense description of the change (max 100 chars):',
    body: 'Provide a longer description of the change (optional). Use "|" to break new line:',
    breaking: 'List any breaking changes (optional). Use "|" to break new line:',
    footer: 'List any issues affected by this change (optional). E.g. "fix #123", "re #123":',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  // Optional, specify if you want to enforce the max line length for the commit message
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: [],
  footerPrefix: 'ISSUES CLOSED:',
  subjectLimit: 100,
};
