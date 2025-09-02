// // Test file for authUtils
// // This is a simple test to verify the authentication utility functions

// import { getUserFromStorage, isAuthenticated, getUserId, clearUserData } from './authUtils';

// // Mock localStorage
// const localStorageMock = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   removeItem: jest.fn(),
//   clear: jest.fn(),
// };

// Object.defineProperty(window, 'localStorage', {
//   value: localStorageMock,
// });

// describe('authUtils', () => {
//   beforeEach(() => {
//     localStorageMock.getItem.mockClear();
//     localStorageMock.setItem.mockClear();
//     localStorageMock.removeItem.mockClear();
//   });

//   describe('getUserFromStorage', () => {
//     it('should return user data when stored as individual keys (Firebase Google auth)', () => {
//       localStorageMock.getItem
//         .mockReturnValueOnce('user123') // _id
//         .mockReturnValueOnce('John Doe') // name
//         .mockReturnValueOnce('john@example.com') // email
//         .mockReturnValueOnce('profile.jpg') // profile_pic
//         .mockReturnValueOnce('user'); // role

//       const user = getUserFromStorage();

//       expect(user).toEqual({
//         _id: 'user123',
//         name: 'John Doe',
//         email: 'john@example.com',
//         profile_pic: 'profile.jpg',
//         role: 'user',
//       });
//     });

//     it('should return user data when stored as JSON object', () => {
//       const userObject = {
//         _id: 'user123',
//         name: 'John Doe',
//         email: 'john@example.com',
//         profile_pic: 'profile.jpg',
//         role: 'user',
//       };

//       localStorageMock.getItem
//         .mockReturnValueOnce(null) // _id
//         .mockReturnValueOnce(null) // name
//         .mockReturnValueOnce(null) // email
//         .mockReturnValueOnce(null) // profile_pic
//         .mockReturnValueOnce(null) // role
//         .mockReturnValueOnce(JSON.stringify(userObject)); // user

//       const user = getUserFromStorage();

//       expect(user).toEqual(userObject);
//     });

//     it('should return null when no user data is found', () => {
//       localStorageMock.getItem.mockReturnValue(null);

//       const user = getUserFromStorage();

//       expect(user).toBeNull();
//     });
//   });

//   describe('isAuthenticated', () => {
//     it('should return true when user is authenticated', () => {
//       localStorageMock.getItem
//         .mockReturnValueOnce('user123') // _id
//         .mockReturnValueOnce('John Doe') // name
//         .mockReturnValueOnce('john@example.com'); // email

//       const authenticated = isAuthenticated();

//       expect(authenticated).toBe(true);
//     });

//     it('should return false when user is not authenticated', () => {
//       localStorageMock.getItem.mockReturnValue(null);

//       const authenticated = isAuthenticated();

//       expect(authenticated).toBe(false);
//     });
//   });

//   describe('getUserId', () => {
//     it('should return user ID when user is authenticated', () => {
//       localStorageMock.getItem
//         .mockReturnValueOnce('user123') // _id
//         .mockReturnValueOnce('John Doe') // name
//         .mockReturnValueOnce('john@example.com'); // email

//       const userId = getUserId();

//       expect(userId).toBe('user123');
//     });

//     it('should return null when user is not authenticated', () => {
//       localStorageMock.getItem.mockReturnValue(null);

//       const userId = getUserId();

//       expect(userId).toBeNull();
//     });
//   });

//   describe('clearUserData', () => {
//     it('should clear all user-related data from localStorage', () => {
//       clearUserData();

//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('_id');
//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('name');
//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('email');
//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('profile_pic');
//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('role');
//       expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
//     });
//   });
// });
