import { LitElement, html, css } from 'lit';
import { delay } from '../helper/delay';
import { randomNormal } from 'd3-random';
import { generateRandNum, generatePermutation } from '../helper/random';
import './Grid';

export default class PlayField extends LitElement {
    #arr = [];
    #positions = [];
    #iterNum = 14; // number of letters in one game
    #n = 2; // the n in dual-n-back
    #numCorrect = 0;
    #numWrong = 0;
    #delay = 1000;

    static properties = {
        _started: { state: true },
        _index: { state: true },
        _posKeyPressed: { state: true },
        _audioKeyPressed: { state: true },
        _keydownResult: { state: true },
    };

    static styles = css`
        :host {
            display: block;
            width: 100vw;
            height: 100vh;
            background-image: url('src/js/resources/images/thanksgiving-vibe.jpg'); /* Path to your image */
            background-size: cover; /* Scale image to cover entire screen */
            background-repeat: no-repeat; /* Prevent tiling */
            background-position: center; /* Center the image */
        }

        .play-field-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }

        .header {
            margin: 5px;
        }

        .grid {
            margin: 5px;
        }

        .controls {
            margin: 5px;
        }

        .pos-control,
        .audio-control {
            margin-left: 5px;
            margin-right: 5px;
        }
    `;

    constructor() {
        super();
        this._started = false;
        this._posKeyPressed = false;
        this._audioKeyPressed = false;

        const audio = document.getElementById('audioPlayer');

        // Listen for the 'ended' event to play the next audio when one finishes
        audio.addEventListener('ended', async () => {
            await delay(this.#delay);

            //evaluate right/wrong
            this.#evaluate();

            await delay(1000);

            // If _index is null, that means the cancel button
            // has been clicked to stop the game, then the next audio
            // should not be played
            if (this._index != null) {
                this._index++;
                this.#playAudio();
            }
        });

        document.addEventListener('keydown', (e) => this.#handleKeyDown(e));
    }

    willUpdate(changedProperties) {
        if (
            changedProperties.has('_posKeyPressed') ||
            changedProperties.has('_audioKeyPressed')
        ) {
            this._keydownResult = this.#getKeydownResult();
        }
    }

    render() {
        return html`<div class="play-field-container">
            ${this.#renderHeader()} ${this.#renderGrid()}
            ${this.#renderControls()}
        </div>`;
    }

    #renderHeader() {
        return html`<div class="header">
            <button @click=${this.#handleStart}>
                ${this._started ? 'cancel' : 'start'}
            </button>
        </div>`;
    }

    #handleStart() {
        if (this._started === false) {
            this.#startGame();
        } else {
            this.#endGame();
        }
    }

    #evaluate() {
        const posBtn = this.shadowRoot.querySelector('.pos-control');
        const audioBtn = this.shadowRoot.querySelector('.audio-control');

        const curr = this._index;
        const prev = curr - this.#n;

        let posCorrect, audioCorrect;
        // When should the pos button show red?
        if (
            (this._index < this.#n && this._posKeyPressed) ||
            (this.#positions[curr] === this.#positions[prev] &&
                !this._posKeyPressed) ||
            (this.#positions[curr] !== this.#positions[prev] &&
                this._posKeyPressed)
        ) {
            posCorrect = false;
            posBtn.style.borderColor = 'red';
        } else {
            posCorrect = true;
            posBtn.style.borderColor = 'green';
        }

        // When should the audio button show red?
        if (
            (this._index < this.#n && this._audioKeyPressed) ||
            (this.#arr[curr] === this.#arr[prev] && !this._audioKeyPressed) ||
            (this.#arr[curr] !== this.#arr[prev] && this._audioKeyPressed)
        ) {
            audioCorrect = false;
            audioBtn.style.borderColor = 'red';
        } else {
            audioCorrect = true;
            audioBtn.style.borderColor = 'green';
        }

        if (audioCorrect && posCorrect) {
            this.#numCorrect++;
        } else {
            this.#numWrong++;
        }

        console.log(`numCorrect: ${this.#numCorrect}`);
    }

    #startGame() {
        // start game
        this._started = true;
        this._posKeyPressed = false;
        this._audioKeyPressed = false;
        this._index = 0;
        this.#numCorrect = 0;
        this.#numWrong = 0;

        console.log('game started!');
        this.#arr = getLetters(this.#iterNum);
        this.#positions = getPositions(this.#iterNum);
        this.#playAudio();
    }

    #endGame() {
        // end game
        const result = this.#numCorrect / this.#iterNum;
        console.log(`Correct rate: ${result * 100}%`);

        // First pause the audio
        const audio = document.getElementById('audioPlayer');
        audio.pause();
        this._started = false;
        this._index = null;

        // Clear control color
        this.#clearControls();
        console.log('game ended!');
    }

    #renderGrid() {
        return html`<div class="grid">
            <ac-grid
                .index=${this._index}
                .arr=${this.#arr}
                .positions=${this.#positions}
            ></ac-grid>
        </div>`;
    }

    #renderControls() {
        return html`<div class="controls">
            <div>
                <button class="pos-control">Position[F]</button
                ><button class="audio-control">Audio[J]</button>
            </div>
        </div>`;
    }

    #handleKeyDown(e) {
        const key = e.key;
        if (key === 'f' || key === 'j') {
            if (key === 'f') {
                this._posKeyPressed = true;
            } else {
                this._audioKeyPressed = true;
            }
            const queryName = key === 'f' ? '.pos-control' : '.audio-control';
            const controlBtn = this.shadowRoot.querySelector(queryName);
            controlBtn.style.backgroundColor = 'yellow';
        }
    }

    #playAudio() {
        if (this._index != null && this._index < this.#arr.length) {
            // clean up keyboard selection
            this.#clearControls();

            const ch = this.#arr[this._index];
            const audio = document.getElementById('audioPlayer');
            audio.src = `src/js/resources/a-z-audio/${ch}.mp3`; // Set the src of the audio element to the next file
            audio
                .play()
                .then(() => {
                    console.log(`Playing audio: ${ch}`);
                    //update grid
                })
                .catch((error) => {
                    console.error('Error while trying to play audio:', error);
                });
        } else {
            this.#endGame();
        }
    }

    #clearControls() {
        this._posKeyPressed = false;
        this._audioKeyPressed = false;

        const posBtn = this.shadowRoot.querySelector('.pos-control');
        posBtn.style.backgroundColor = '';
        posBtn.style.borderColor = 'inherit';
        const audioBtn = this.shadowRoot.querySelector('.audio-control');
        audioBtn.style.backgroundColor = '';
        audioBtn.style.borderColor = 'inherit';
    }

    #getKeydownResult() {
        const res = [];
        if (this._posKeyPressed) {
            res.push('F');
        }
        if (this._audioKeyPressed) {
            res.push('J');
        }
        return res;
    }
}

customElements.define('ac-play-field', PlayField);

function getLetters(len) {
    const letterPool = 'KRQSL';
    const results = [];
    for (let i = 0; i < len; i++) {
        results.push(letterPool[generateRandNum(0, letterPool.length - 1)]);
    }
    console.log(`letters: ${results}`);
    return results;
}

function getPositions(len) {
    const numPool = generatePermutation();
    console.log(`permutation: ${numPool}`);
    const results = [];
    for (let i = 0; i < len; i++) {
        const idx = getRandomIndex();
        console.log(`random idx is: ${idx}`);
        results.push(numPool[idx]);
    }
    console.log(`positions: ${results}`);
    return results;
}

function getRandomIndex() {
    const idx = Math.round(randomNormal(5, 2)());
    if (idx < 0) {
        return 0;
    }
    if (idx > 8) {
        return 8;
    }
    return idx;
}
