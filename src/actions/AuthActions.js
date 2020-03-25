import firebase from '../FirebaseConnection';

export const isLogged = () => {
  return dispatch => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch({
          type: 'SIGNED',
          payload: {
            signed: true,
          },
        });
      } else {
        dispatch({
          type: 'SIGNED',
          payload: {
            signed: false,
          },
        });
      }
    });
  };
};

export const signOut = () => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem('Signed');
        resolve();
      })
      .catch(() => {
        reject(new Error());
      });
  });
};

export const setUID = uid => {
  return dispatch => {
    dispatch({
      type: 'SET_UID',
      payload: {
        uid,
      },
    });
  };
};

export const createNewUser = (email, password, cpf) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
              setUID(user.uid);
              dispatch({
                type: 'SET_INFOS',
                payload: {
                  email: user.email,
                },
              });
              firebase
                .database()
                .ref(`Users/${user.uid}`)
                .set({ cpf });
              resolve();
            })
            .catch(error => {
              let errorMessage = '';
              switch (error.code) {
                case 'auth/email-already-in-use':
                  errorMessage = 'E-mail já utilizado';
                  break;
                case 'auth/invalid-email':
                  errorMessage = 'E-mail inválido!';
                  break;
                case 'auth/operation-not-allowed':
                  errorMessage = 'Tente novamente mais tarde';
                  break;
                case 'auth/weak-password':
                  errorMessage = 'Digite uma senha melhor!';
                  break;
                default:
              }
              reject(new Error(errorMessage));
            });
        })
        .catch(() => {
          reject(new Error('Error ao cadastrar, tente novamente!'));
        });
    });
  };
};

export const SignInAction = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const { uid } = firebase.auth().currentUser;

        setUID(uid);
        localStorage.setItem('Signed', true);
        resolve();
      })
      .catch(error => {
        let errorMessage = '';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Email inválido!';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Seu usuário está desativado!';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Não existe este usuário!';
            break;
          case 'auth/wrong-password':
            errorMessage = 'E-mail e/ou senha errados!';
            break;
          default:
        }
        reject(new Error(errorMessage));
      });
  });
};

export const loginWithFacebook = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          const { uid } = firebase.auth().currentUser;
          setUID(uid);
          localStorage.setItem('Signed', true);
          resolve();
        })
        .catch(() => {
          reject(new Error('Falha ao logar, tente novamente!'));
        });
    });
  };
};