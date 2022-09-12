const appStoreReview = true;

const isTestUser = (user: any) => user.name?.includes('@test');

const isUnitTestUser = (user: any) => user.name?.includes('testid-@4183@-');

export const filterUsers = (users: string[]) =>
  users.filter((user) => {
    let shouldFilter = false;

    if (isUnitTestUser(user)) {
      shouldFilter = true;
    } else if (appStoreReview && isTestUser(user)) {
      shouldFilter = false;
    } else if (!__DEV__ && isTestUser(user)) {
      shouldFilter = true;
    }
    return !shouldFilter;
  });
