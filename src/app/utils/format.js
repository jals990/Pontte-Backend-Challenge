export const formatStatus = (value) =>
  value
    .toString()
    .replace(1, 'Request registered, await docs.')
    .replace(2, 'Documents registered, await finish')
    .replace(3, 'Request finish, accepted')
    .replace(4, 'Request finish, rejected');
