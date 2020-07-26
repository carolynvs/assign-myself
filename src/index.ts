import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import Webhooks from '@octokit/webhooks'

export = (app: Application) => {
  app.on('issue_comment.created', async (context) => {
    const org = context.payload.repository.owner.login
    const username = context.payload.sender.login
    const assignee = context.payload.issue.assignee
    const config = (await context.config('assign-myself.yml',    
      { 
        team: '',
        claimMessage: ['I want to work on this', '/assign'],
        assignedMessage: 'Thanks for helping! I have assigned this issue to you. 👍',
        noReassignmentMessage: 'Someone is already assigned to this issue.',
        helpMessage: 'Sorry, I could not assign this issue to you. Please contact the maintainers for help.'
      }
    ))!; // Assert that the config isn't null
    
    // Check if we should assign this issue
    let requestedAssignment = false
    config.claimMessage.forEach(function(msg){
      if (context.payload.comment.body.includes(msg)) {
        requestedAssignment = true
      }
    })
    if (!requestedAssignment) {
      return
    }

    // Check if they are on the allowed team, if defined
    let requiredTeamCheckPassed = true
    if (config.team != '') {
        requiredTeamCheckPassed = await onTeam(username, config.team, org, context, app)
    }
    if (!requiredTeamCheckPassed) {
      return
    }

    // Tell them it's already assigned
    if (assignee != null) {
      await postComment(config.noReassignmentMessage, context, app)
      return
    }

    // Assign the issue to them
    try{
      await assignIssue(username, context, app)
    } catch(error){
      await postComment(config.helpMessage, context, app)
      throw error
    }

    // Tell them you have assigned it
    await postComment(config.assignedMessage, context, app)
  })
}

async function postComment(body: string, context: Context<Webhooks.WebhookPayloadIssueComment>, app: Application) {
  const reply = context.issue({ body: body })
  try {
    await context.github.issues.createComment(reply)
  } catch (error) {
    app.log(`error leaving comment ${reply.body} on #${context.url}: ${error}`)
    throw error
  }
}

async function assignIssue(username: string, context: Context<Webhooks.WebhookPayloadIssueComment>, app: Application) {
  const issue = context.issue()
  try {
    await context.github.issues.addAssignees({
      owner: issue.owner,
      repo: issue.repo,
      'issue_number': issue.number,
      assignees: [username],
    });
  } catch (error) {
    app.log(`error assigning #${context.url} to ${username}: ${error}`)
    throw error
  }
}

async function onTeam (username: string, team: string, org: string, context: Context<Webhooks.WebhookPayloadIssueComment>, app: Application) : Promise<boolean> {
  try {
    let onTeam = await context.github.request('GET /orgs/{org}/teams/{team_slug}/memberships/{username}', {
      org: org,
      team_slug: team,
      username: username
    })
    return onTeam.status != 404
  } catch (error) {
    app.log(`error checking team membership of ${username} in ${org}/${team}: ${error}`)
    throw error
  }
}
