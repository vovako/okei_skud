import { screen, render, fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";

describe("login page tests", () => {
	it("Не заполнены поля", () => {
		const { container } = render(<LoginPage />);
		fireEvent.change(screen.getByPlaceholderText('Логин'), {target: {value: ''}})
		fireEvent.change(screen.getByPlaceholderText('Пароль'), {target: {value: ''}})
		fireEvent.click(container.querySelector('.login-btn')!)
		expect(container.querySelector('.login-form__notice')?.textContent).toEqual('Не все поля заполнены')
	});
	it("Не все поля заполнены", () => {
		const { container } = render(<LoginPage />);
		fireEvent.change(screen.getByPlaceholderText('Логин'), { target: { value: 'login' } })
		fireEvent.click(container.querySelector('.login-btn')!)
		expect(container.querySelector('.login-form__notice')?.textContent).toEqual('Не все поля заполнены')
	});
	it("Ввод недействительных данных", () => {
		const { container } = render(<LoginPage />);
		fireEvent.change(screen.getByPlaceholderText('Логин'), { target: { value: 'login' } })
		fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password' } })
		fireEvent.click(container.querySelector('.login-btn')!)
		expect(container.querySelector('.login-form__notice')?.textContent).toEqual('Неправильный логин или пароль')
	});
	it("Ввод действительных данных", () => {
		const { container } = render(<LoginPage />);
		fireEvent.change(screen.getByPlaceholderText('Логин'), { target: { value: 'Izumra' } })
		fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: '!Izumra17.' } })
		fireEvent.click(container.querySelector('.login-btn')!)
		expect(container.querySelector('.login-form__notice')?.textContent).toEqual('')
	});
});