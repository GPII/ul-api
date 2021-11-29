# Contributing Code Changes

The process for making code changes within the UL API team is generally as follows:

1. Create an issue in GitHub to track the work.
2. Discuss the issue with the team and agree on whether/how to proceed.
3. Fork the code locally if you have not already done so.
4. Create a local branch whose name matches the GitHub issue.  If the issue number is #3, the branch should be `GH-3`.
5. Make the changes agreed in step 2.  All commit messages should be prefixed with the branch/issue details, i.e.
   `GH-3: Updated key dependencies`.
6. Create a pull request comparing your fork/branch to `main`.
7. Discuss the review with the team and agree on how/when it will be reviewed.
8. Work together with reviewer(s) to address any feedback.

A pull request is more likely to be accepted if it:

1. Makes a small, clearly identified, and well described change.
2. Does not break any tests.
3. Includes tests for any new functionality, so that the code coverage remains high.
4. Passes all linting checks.  This sometimes involves reformatting code to match the existing style.  It can also
   involve discussing and making changes to the linting checks. 
