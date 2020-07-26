# assign-myself

> A GitHub App built with [Probot](https://github.com/probot/probot) that
> contributors can use to assign themselves to issues with a comment.

1. Have a wonderful issue that someone wants to fix.
1. They comment on the issue "I want to fix this".
1. The app assigns the issue* to them and comments that it is assigned to them.

\* The app does not assign issues to contributors if the issue is already assigned.

## Configure 

Save **.github/assign-myself.yml** to your repository and override any setting
that looks interesting.

```yaml
# limit who can self-assign to users in the specified team
team: team-slug 

# Search issue comments for these substrings to determine if
# the issue should be assigned
claimMessage:
  -  'I want to work on this'
  -  '/assign'

# Comment with this message when the issue is assigned
assignedMessage: 'Thanks for helping! I have assigned this issue to you. 👍'

# Comment with this message when the issue is already assigned
noReassignmentMessage: 'Someone is already assigned to this issue'

# Comment with this message when there is an error assigning the issue
helpMessage: 'Sorry, I could not assign this issue to you. Please contact the maintainers for help.'
```

## Run locally

```sh
npm install
npm run dev
```

## Contributing

If you have suggestions for how assign-myself could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2020 Carolyn Van Slyck
