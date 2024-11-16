import { LitElement, html } from 'lit';
import './PlayField';

export default class Workspace extends LitElement {
    render() {
        return html`<ac-play-field></ac-play-field>`;
    }
}

customElements.define('ac-workspace', Workspace);
