import { LitElement, html, css } from 'lit';
import './Dropdown';

export default class Settings extends LitElement {
    settings;

    static styles = css`
        .set-N,
        .set-iterations {
            display: flex;
            flex-direction: row;
        }

        .label-N {
            margin-right: 61px;
        }

        .label-iter {
            margin-right: 5px;
        }

        .iter-input {
            width: 66px;
        }
    `;

    render() {
        const items = Array.from(
            { length: this.settings.totalIterations },
            (_, i) => i + 1
        );
        return html`<div class="set-N">
                <div class="label-N">N:</div>
                <ac-dropdown
                    class="dropdown-N"
                    @select-change=${this.#setN}
                    .selectedIndex=${this.settings.N - 1}
                    .items=${items}
                ></ac-dropdown>
            </div>
            <div class="set-iterations">
                <div class="label-iter">Iteration #:</div>
                <input
                    class="iter-input"
                    type="text"
                    @blur=${this.#setIterationNumber}
                    .value=${this.settings.totalIterations}
                />
            </div> `;
    }

    #setN(e) {
        console.log(`selected N is set as: ${e.detail.selectedItem}`);
        this.settings.N = e.detail.selectedItem;
    }

    #setIterationNumber(e) {
        const newVal = Number(e.target.value);
        if (Number.isInteger(newVal) && newVal > 0) {
            this.settings.totalIterations = newVal;
            console.log(
                `total number of iterations is set as: ${e.target.value}`
            );
        }
    }
}

customElements.define('ac-settings', Settings);
