const ErrorEnum = {
  OK: {code: 200, message: "OK"},
  Unhandled: {code: 404, message: "Fatal: Unexpected Error!!"},
  WrongPassword: {code: 422, message: "Wrong password."},
  WrongToken: {code: 423, message: "Wrong Token. Have you log in the other device?"},
  Exist: (item) => ({code: 431, message: item + " exists in the Database."}),
  NotFound: (item) => ({code: 421, message: item + " does not exist in the Database."}),
  NotCreated: (item) => ({code: 503, message: "Cannot Create " + item + '.'}),
  NotDeleted: (item) => ({code: 503, message: "Cannot Delete " + item + '.'}),
  NotUpdated: (item) => ({code: 503, message: "Cannot Update " + item + '.'}),
}

module.exports = ErrorEnum;