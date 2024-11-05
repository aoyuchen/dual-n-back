import { LitElement, html } from 'lit';

export default class TestAudio extends LitElement {
    render() {
        return html`<div>Hello World!</div>`;
    }
}
customElements.define('ac-test-audio', TestAudio);
