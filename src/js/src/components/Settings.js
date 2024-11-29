import { LitElement, html, css } from 'lit';
import './Dropdown';

export default class Settings extends LitElement {
    settings;

    static styles = css`
        .set-N {
            display: flex;
            flex-direction: row;
        }

        .label-N {
            margin-right: 5px;
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
        </div>`;
    }

    #setN(e) {
        console.log(`selected N is: ${e.detail.selectedItem}`);
        this.settings.N = e.detail.selectedItem;
    }
}

customElements.define('ac-settings', Settings);
