import { unicodeIcons } from "./unicodeIcons.mjs";

export function getActionsByCommandHashMap(){
  return {
    json: ({ total, additions, deletions, errors }) =>
      JSON.stringify({
        total,
        additions,
        deletions,
        errors
      }),
    human: ({ total, additions, deletions, errors }) =>[
      `Total: ${total}`,
      `Additions: ${additions}`,
      `Deletions: ${deletions}`,
      'Errors:',
      ...errors
    ],
    "html-table": ({ total, additions, deletions, errors }) =>
      `
      <table>
        <tbody>
          <tr>
            <td>Total ${unicodeIcons.SUM}</td>
            <td>${total}</td>
          </tr>
          <tr>
            <td>Additions ${unicodeIcons.LARGE_GREEN_CIRCLE}</td>
            <td>${additions}</td>
          </tr>
          <tr>
            <td>Deletions ${unicodeIcons.LARGE_RED_CIRCLE} </td>
            <td>${deletions}</td>
          </tr>
          ${
            errors.length
              ? "<tr><td colspan=2>" +
                errors.map(error=>unicodeIcons.CROSS + ' ' + error).join("</td></tr><tr><td colspan=2>") +
                "</td></tr>"
              : ""
          }
        </tbody>
      </table>`
        .split("\n")
        .map((line) => line.trim())
        .join(""),
    complete: ({ total, additions, deletions, changes, errors }) => {
      console.table(changes);
      console.table({ total, additions, deletions });
  
      return errors.join("\n");
    },
  };
  
}