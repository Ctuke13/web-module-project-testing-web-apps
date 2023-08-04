import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";
import DisplayComponent from "./DisplayComponent";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);

  const header = screen.getByText("Contact Form");

  expect(header).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstName = screen.getByLabelText(/first name*/i);

  userEvent.type(firstName, "1234");
  const error = await screen.findAllByTestId("error");

  expect(error.length).toBe(1);
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  const errors = await screen.findAllByTestId("error");

  expect(errors.length).toBe(3);
  errors.forEach((error) => {
    expect(error).toBeVisible();
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);

  const firstName = screen.getByLabelText(/first name*/i);
  const lastName = screen.getByLabelText(/last name*/i);
  const email = screen.getByLabelText(/email*/i);
  const submitButton = screen.getByRole("button");
  userEvent.type(firstName, "123456");
  userEvent.type(lastName, "123456");
  userEvent.type(email, " ");
  userEvent.click(submitButton);

  const emailError = await screen.findAllByTestId("error");
  expect(emailError.length).toBe(1);
  expect(emailError[0]).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

  const emailInput = screen.getByLabelText(/email*/i);
  const submitButton = screen.getByRole("button");
  userEvent.type(emailInput, "123-234.com");
  userEvent.click(submitButton);
  const emailError = await screen.findAllByText(
    /email must be a valid email address/i
  );

  expect(emailError[0]).toBeVisible();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  const lastNameError = await screen.findByText(
    /lastName is a required field/i
  );

  expect(lastNameError).toBeVisible();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, "Michael");
  const lastName = screen.getByLabelText(/last name*/i);
  userEvent.type(lastName, "Jackson");
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, "mjackson@motown.com");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await screen.findByText("Michael");
  await screen.findByText("Jackson");
  await screen.findByText("mjackson@motown.com");
  const message = screen.findByTestId("messageDisplay");
  expect(screen.queryByText(message)).toBeNull();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const firstName = screen.getByLabelText(/first name*/i);
  userEvent.type(firstName, "Michael");
  const lastName = screen.getByLabelText(/last name*/i);
  userEvent.type(lastName, "Jackson");
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, "mjackson@motown.com");
  const message = screen.getByLabelText(/message/i);
  userEvent.type(message, "King of Pop");

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await screen.findByText("Michael");
  await screen.findByText("Jackson");
  await screen.findByText("mjackson@motown.com");
  await screen.findByText("King of Pop");
});
