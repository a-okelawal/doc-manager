/**
 * This is a middleware checker to see if user is admin.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {void}
*/
export default function adminRoleCheck(req, res, next) {
  if (req.decoded.RoleId === 1 || req.body.username === req.decoded.username ||
    req.params.username === req.decoded.username) {
    next();
  } else {
    res.status(403).send({ message: 'Access denied.' });
  }
}
