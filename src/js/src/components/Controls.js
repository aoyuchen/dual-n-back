import { LitElement, html, css } from 'lit';

export default class Controls extends LitElement {
    #pressedKeys = [];

    static properties = {
        result: { type: Object },
    };
    constructor() {
        super();
        document.addEventListener('keydown', (e) => this.#handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.#handleKeyUp(e));
    }

    render() {
        return html`<button class="left-control">Position[F]</button
            ><button class="right-control">Audio[J]</button>
            <div>Keydown result: ${this.result}</div>`;
    }

    #handleKeyDown(e) {
        const key = e.key;
        if (key === 'f' || key === 'j') {
            this.#pressedKeys.push(key);
            //this.result = [...this.#pressedKeys];

            const queryName = key === 'f' ? '.left-control' : '.right-control';
            const controlBtn = this.shadowRoot.querySelector(queryName);
            controlBtn.style.backgroundColor = 'green';
        }
    }

    #handleKeyUp(e) {
        const key = e.key;
        if (key === 'f' || key === 'j') {
            const idx = this.#pressedKeys.indexOf(key);
            if (idx !== -1) {
                this.#pressedKeys.splice(idx, 1);
            }
            //this.result = [...this.#pressedKeys];

            const queryName = key === 'f' ? '.left-control' : '.right-control';
            const controlBtn = this.shadowRoot.querySelector(queryName);
            controlBtn.style.backgroundColor = '';
        }
    }
}

customElements.define('ac-controls', Controls);
