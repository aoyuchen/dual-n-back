import { LitElement, html, css } from 'lit';
import './Header';
import './Grid';
import './Controls';

export default class PlayField extends LitElement {
    static styles = css`
        .play-field {
            display: flex;
            flex-direction: column;
        }
    `;
    render() {
        return html`<div class="play-field">
            <ac-header></ac-header><ac-grid></ac-grid
            ><ac-controls></ac-controls>
        </div>`;
    }
}

customElements.define('ac-play-field', PlayField);
