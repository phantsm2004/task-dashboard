import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import GlobalTaskForm from './GlobalTaskForm';

const { addTask, addTag } = vi.hoisted(() => ({
  addTask: vi.fn(),
  addTag: vi.fn()
}));

vi.mock('../../../context/TaskContext', () => ({
  useTaskContext: () => ({ addTask })
}));
vi.mock('../../../context/TagContext', () => ({
  useTagContext: () => ({ tags: [], addTag })
}));

beforeEach(() => vi.clearAllMocks());

test('submits a task with tags entered using Enter and comma', async () => {
  const user = userEvent.setup();
  const onCancel = vi.fn();
  render(<GlobalTaskForm onCancel={onCancel} />);

  expect(screen.getByTestId('task-input')).toHaveFocus();
  expect(screen.getByTestId('submit-button')).toBeDisabled();
  await user.type(screen.getByTestId('task-input'), 'Review dependencies');
  await user.type(screen.getByTestId('tag-input'), 'urgent{Enter}office,');
  expect(screen.getByTestId('selected-tag-urgent')).toBeInTheDocument();
  expect(screen.getByTestId('selected-tag-office')).toBeInTheDocument();
  expect(addTask).not.toHaveBeenCalled();
  await user.click(screen.getByTestId('submit-button'));
  expect(addTask).toHaveBeenCalledExactlyOnceWith({
    title: 'Review dependencies',
    description: '',
    isCompleted: false,
    tags: ['urgent', 'office']
  });
  expect(onCancel).toHaveBeenCalledOnce();
});

test('supports keyboard focus navigation and cancelling without submission', async () => {
  const user = userEvent.setup();
  const onCancel = vi.fn();
  render(<GlobalTaskForm onCancel={onCancel} />);

  await user.type(screen.getByTestId('task-input'), 'Do not save');
  await user.tab();
  expect(screen.getByTestId('cancel-button')).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onCancel).toHaveBeenCalledOnce();
  expect(addTask).not.toHaveBeenCalled();
});
