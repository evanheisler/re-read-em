import React from 'react'
import { useQuery, gql } from '@apollo/client'
import moment from 'moment'
import './app.scss'

const README_FILES = gql`
  {
    organization(login: "softwareforgood") {
      repositories(first: 20, orderBy: { field: UPDATED_AT, direction: DESC }) {
        repository: nodes {
          name
          url
          readMe: object(expression: "master") {
            ... on Commit {
              history: blame(path: "./README.md") {
                commits: ranges {
                  commit {
                    date: committedDate
                    id: abbreviatedOid
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const App = () => {
  const { loading, error, data } = useQuery(README_FILES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const { repository } = data.organization.repositories

  return (
    <div className="table-container" role="table" aria-label="Destinations">
      <div className="flex-table header" role="rowgroup">
        <div className="flex-row first" role="columnheader">
          Repository
        </div>
        <div className="flex-row" role="columnheader">
          README file
        </div>
      </div>

      {repository.map((repo) => {
        const { commits } = repo.readMe.history
        const dates = commits.map((c) => moment(c.commit.date))
        const recent = moment.max(dates)

        return (
          <div key={repo.name} className="flex-table row" role="rowgroup">
            <div className="flex-row first" role="cell">
              <a
                href={`${repo.url}/blob/master/README.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
            </div>
            <div className="flex-row" role="cell">
              last updated {moment(recent).format('MMM DD, YYYY')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default App
