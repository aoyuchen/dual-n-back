import { LitElement, html, css } from 'lit';
import caretDownFill from '../../resources/images/caret-down-fill.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

// To use this dropdown, the container needs to provider the following information:
// 1. items (length > 0)
// 2. selected index (optional, if not provided, select index 0)
// When an item is selected, dropdown needs to notify container the selected result.
// selectedIndex must be within the length range of items array
export default class Dropdown extends LitElement {
    static properties = {
        selectedIndex: { type: Object }, // Must be an integer between [0, items.length)
        items: { type: Object }, // an array of strings to be displayed in the dropdown menu
    };

    static styles = css`
        /* Dropdown container */
        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-group {
            display: flex;
            height: 20px;
        }

        .dropdown-text {
            resize: none;
            min-width: 10px;
            overflow: hidden;
            width: 40px;
            border: none;
            overflow: none;
            rows: 1;
        }

        /* Toggle button */
        .dropdown-toggle {
            display: flex;
            border: none;
            cursor: pointer;
            font-size: 16px;
            align-items: center;
            justify-content: center;
            background-color: none;
        }

        /* Dropdown menu (hidden by default) */
        .dropdown-menu {
            display: none; /* Hidden initially */
            position: absolute;
            background-color: white;
            border: 1px solid #ccc;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            min-width: 40px;
            z-index: 1000;
            width: 60px;
            max-height: 200px;
            overflow: auto;
        }

        /* Dropdown menu items */
        .dropdown-menu a {
            display: block;
            padding: 10px;
            color: black;
            text-decoration: none;
        }

        .dropdown-menu a:hover {
            background-color: #f0f0f0;
        }
    `;

    constructor() {
        super();
        const listener = () => {
            const dropdownMenu =
                this.shadowRoot.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        };
        document.addEventListener('click', listener);
    }

    render() {
        return html` <div class="dropdown">
            <div class="dropdown-group">
                <input
                    type="text"
                    id="user-selected-N"
                    class="dropdown-text"
                    @blur=${this.#handleTextInput}
                    .value=${this.items[this.selectedIndex ?? 0]}
                />
                <button
                    class="dropdown-toggle"
                    @click=${this.#showDropdownMenu}
                >
                    ${unsafeSVG(caretDownFill)}
                </button>
            </div>
            <div class="dropdown-menu" @click=${this.#itemSelected}>
                ${this.items.map(
                    (item, index) =>
                        html`<a class="dropdown-item" href="#" .index=${index}
                            >${item}</a
                        >`
                )}
            </div>
        </div>`;
    }

    #showDropdownMenu(e) {
        e.stopPropagation();
        const dropdownMenu = this.shadowRoot.querySelector('.dropdown-menu');
        dropdownMenu.style.display = 'block';
        if (dropdownMenu.scrollHeight > dropdownMenu.clientHeight) {
            this.#centerSelectedItem(dropdownMenu);
        }
    }

    #handleTextInput(e) {
        const oldVal = this.selectedIndex;
        const index = this.items.indexOf(Number(e.target.value));
        if (oldVal === index || index === -1) {
            e.target.value = this.items[oldVal];
            return;
        }
        this.selectedIndex = index;
        this.#dispatchSelectChangeEvent(
            e,
            this.selectedIndex,
            this.items[this.selectedIndex]
        );
    }

    #centerSelectedItem(dropdownMenu) {
        const dropdownItems =
            this.shadowRoot.querySelectorAll('.dropdown-item');
        const selectedItem = dropdownItems[this.selectedIndex];
        if (selectedItem) {
            const itemHeight = selectedItem.offsetHeight;
            const menuHeight = dropdownMenu.offsetHeight;

            // Calculate the position to scroll the selected item to the center
            const scrollTop =
                selectedItem.offsetTop - menuHeight / 2 + itemHeight / 2;

            // Scroll to that position
            dropdownMenu.scrollTop = scrollTop;
        }
    }

    #itemSelected(e) {
        if (this.selectedIndex !== e.target.index) {
            this.selectedIndex = e.target.index;
            this.#dispatchSelectChangeEvent(
                e,
                this.selectedIndex,
                this.items[this.selectedIndex]
            );
        }
    }

    #dispatchSelectChangeEvent(e, index, item) {
        const customEvent = new CustomEvent('select-change', {
            detail: {
                selectedIndex: index,
                selectedItem: item,
            },
            bubbles: true, // Allow the event to bubble up to parent elements
            composed: true,
        });

        // Dispatch the custom event from the child element
        e.target.dispatchEvent(customEvent);
    }
}

customElements.define('ac-dropdown', Dropdown);
