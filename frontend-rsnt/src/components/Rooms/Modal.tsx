import React, { useState } from 'react';
import { createSession } from '../../utils/api';
import { navigate } from '@reach/router';
import { gaEvent } from '../../utils/analytics';

type Props = {
  token: string;
  closeModal: () => void;
};

export const Modal: React.FC<Props> = (props) => {
  const { token, closeModal } = props;

  const [form, setForm] = useState({
    name: '',
    description: '',
    public: true,
  });

  const handleCheck = ({ target }) =>
    setForm((state) => ({ ...state, public: target.checked }));

  const handleInput = ({ target }) =>
    setForm((state) => ({ ...state, [target.name]: target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createSession(token, {
        ...form,
        roomAccess: form.public ? 'PUBLIC' : 'PRIVATE',
      });
      gaEvent('click', 'room', 'create', form.name);
      navigate(`/party?sessionId=${data.id}`);
    } catch (err) {
      console.log(err);
    }
    closeModal();
  };

  return (
    <>
      <div
        onClick={closeModal}
        className="fixed left-0 top-0 right-0 bottom-0 z-10 flex bg-black bg-opacity-75"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-black2light py-40 rounded-lg shadow-xs z-10 fixed left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white flex flex-col w-30rem p-30"
      >
        <input
          required
          name="name"
          onChange={handleInput}
          className="mb-20 text-20 bg-black2lighter rounded p-10 text-white placeholder-greylight"
          placeholder="Name"
        />
        <input
          name="description"
          onChange={handleInput}
          className="mb-20 text-20 bg-black2lighter rounded p-10 text-white placeholder-greylight"
          placeholder="Description"
        />
        <label>
          <input
            className="mb-40"
            type="checkbox"
            checked={form.public}
            onChange={handleCheck}
          />
          <span className="pl-10 text-greylight text-20">
            {form.public ? 'Public' : 'Private'}
          </span>
        </label>
        <button
          type="submit"
          className="bg-green text-white font-bold text-18
                p-10 px-20 rounded-full uppercase"
        >
          Create
        </button>
      </form>
    </>
  );
};
