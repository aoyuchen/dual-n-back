import { css, html, LitElement } from 'lit';
import { delay } from '../helper/delay';

export default class Grid extends LitElement {
    #ch;
    #pos;

    static properties = {
        index: { type: Object },
        arr: { type: Object },
        positions: { type: Object },
    };

    //grid-area: <name> | <row-start> / <column-start> / <row-end> / <column-end>;
    static styles = css`
        .grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            width: 600px;
            height: 600px;
        }

        .grid-item {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
            border: 1px solid black;
            overflow: hidden;
            height: 200px;
        }

        #p1 {
            grid-area: 1/1/2/2;
        }

        #p2 {
            grid-area: 1/2/2/3;
        }

        #p3 {
            grid-area: 1/3/2/4;
        }

        #p4 {
            grid-area: 2/1/3/2;
        }

        #p5 {
            grid-area: 2/2/3/3;
        }

        #p6 {
            grid-area: 2/3/3/4;
        }

        #p7 {
            grid-area: 3/1/4/2;
        }

        #p8 {
            grid-area: 3/2/4/3;
        }

        #p9 {
            grid-area: 3/3/4/4;
        }
    `;

    async willUpdate(changedProperties) {
        if (changedProperties.has('index') && this.#updateCharAndPos()) {
            const gridItem = this.shadowRoot.getElementById(gridId(this.#pos));
            gridItem.style.backgroundColor = 'red';
            gridItem.innerHTML = this.#ch;
            await delay(500);
            gridItem.style.backgroundColor = '';
            gridItem.innerHTML = '';
        }
    }

    render() {
        return html` <div class="grid-container">
            <div class="grid-item" id="p1"></div>
            <div class="grid-item" id="p2"></div>
            <div class="grid-item" id="p3"></div>
            <div class="grid-item" id="p4"></div>
            <div class="grid-item" id="p5"></div>
            <div class="grid-item" id="p6"></div>
            <div class="grid-item" id="p7"></div>
            <div class="grid-item" id="p8"></div>
            <div class="grid-item" id="p9"></div>
        </div>`;
    }

    // Return true when both 'ch' and 'pos' are valid
    #updateCharAndPos() {
        this.#ch =
            this.index != null && this.arr ? this.arr[this.index] : undefined;
        this.#pos =
            this.index != null && this.positions
                ? this.positions[this.index]
                : undefined;

        return this.#ch && this.#pos;
    }
}

customElements.define('ac-grid', Grid);

function gridId(pos) {
    return `p${pos}`;
}
