import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

HTMLDialogElement.prototype.show = vi.fn(function mock(this: HTMLDialogElement) {
	this.open = true;
});

HTMLDialogElement.prototype.showModal = vi.fn(function mock(this: HTMLDialogElement) {
	this.open = true;
});

HTMLDialogElement.prototype.close = vi.fn(function mock(this: HTMLDialogElement) {
	this.open = false;
});
