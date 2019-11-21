import Component from '../Component.js';
import Header from '../common/Header.js';
import Footer from '../common/Footer.js';
import SignUp from './SignUp.js';
import SignIn from './SignIn.js';
import { signUp as userSignUp, signIn as userSignIn } from '../services/hikes-api.js';

function success(user) {
    localStorage.setItem('USER', JSON.stringify(user));
    const searchParams = new URLSearchParams(location.search);
    location = '/hikes.html';
}

class App extends Component {

    onRender(dom) {
        const header = new Header();
        dom.prepend(header.renderDOM());

        const errors = dom.querySelector('.errors');
        const signUpContainer = dom.querySelector('#signup-container');
        const signInContainer = dom.querySelector('#signin-container');
        
        const signUp = new SignUp({
            onSignUp: async newUser => {
                errors.textContent = '';

                try {
                    const user = await userSignUp(newUser);
                    success(user);
                }
                catch (err) {
                    errors.textContent = err;
                    throw err;
                }
            }
        });
        signUpContainer.appendChild(signUp.renderDOM());
        
        const signIn = new SignIn({
            onSignIn: async credentials => {
                errors.textContent = '';

                try {
                    const user = await userSignIn(credentials);
                    success(user);
                }
                catch (err) {
                    errors.textContent = err;
                    throw err;
                }
            }
        });
        signInContainer.appendChild(signIn.renderDOM());

        const switchToSignIn = dom.querySelector('#signin-button');
        switchToSignIn.addEventListener('click', () => {
            signInContainer.classList.remove('no-display');
            signUpContainer.classList.add('no-display');
        });
        
        const switchToSignUp = dom.querySelector('#signup-button');
        switchToSignUp.addEventListener('click', () => {
            signUpContainer.classList.remove('no-display');
            signInContainer.classList.add('no-display');
        });

        const footer = new Footer();
        dom.appendChild(footer.renderDOM());
    }

    renderHTML() {
        // TO DO: update what is shown to user based on sign in status
        return /*html*/`
            <div>
                <!-- header goes here -->
                <main>
                    <section class="no-display" id="signup-container">
                    <p class="errors"></p>
                        <p class="switch">
                        <button id="signin-button">Existing User Sign-In</button>
                        </p>
                    </section>
                    <section id="signin-container">
                        <p class="switch">
                        <button id="signup-button">New User Registration</button>
                        </p>
                    </section>
                </main>
                <!-- footer goes here -->
            </div>
        `;
    }
}

export default App;