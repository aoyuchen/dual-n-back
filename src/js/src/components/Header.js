import { LitElement, html, css } from 'lit';
import { delay } from '../helper/delay';

export default class Header extends LitElement {
    #arr;
    #index = 0;

    static properties = {
        _started: { state: true },
    };

    constructor() {
        super();
        this._started = false;
        const audio = document.getElementById('audioA');
        // Listen for the 'ended' event to play the next audio when one finishes
        audio.addEventListener('ended', async () => {
            await delay(5000);
            //evaluate right/wrong

            this.#playAudio();
        });
    }

    render() {
        return html`${this.#renderButton()}`;
    }

    #renderButton() {
        return html`<button @click=${this.#handleButtonClick}>
            ${this._started ? 'cancel' : 'start'}
        </button>`;
    }

    #handleButtonClick() {
        if (this._started === false) {
            // start game
            this._started = true;
            console.log('game started!');
            this.#startGame();
        } else {
            // end game
            this._started = false;
            this.#index = this.#arr.length;
            console.log('game ended!');
        }
    }

    #startGame() {
        this.#arr = getLetters();
        this.#index = 0;
        this.#playAudio();
    }

    #playAudio() {
        if (this.#index < this.#arr.length) {
            // clean up keyboard selection

            const ch = this.#arr[this.#index];
            const audio = document.getElementById('audioA');
            audio.src = `src/js/resources/a-z-audio/${ch}.mp3`; // Set the src of the audio element to the next file
            audio
                .play()
                .then(() => {
                    console.log(`Playing audio: ${ch}`);
                })
                .catch((error) => {
                    console.error('Error while trying to play audio:', error);
                });
            this.#index++; // Move to the next audio file
        }
    }
}

customElements.define('ac-header', Header);
