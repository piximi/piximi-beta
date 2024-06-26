import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import type { DeferredEntityAdapter } from "../index";
import type { BookModel } from "./fixtures/book";
import { createDeferredEntityAdapter } from "../create_deferred_adapter";

describe("createStateOperator", () => {
  let adapter: DeferredEntityAdapter<BookModel>;

  beforeEach(() => {
    adapter = createDeferredEntityAdapter({
      selectId: (book: BookModel) => book.id,
    });
  });
  it("Correctly mutates a draft state when inside `createNextState", () => {
    const booksSlice = createSlice({
      name: "books",
      initialState: adapter.getInitialState(),
      reducers: {
        // We should be able to call an adapter method as a mutating helper in a larger reducer
        addOne(state, action: PayloadAction<BookModel>) {
          // Originally, having nested `produce` calls don't mutate `state` here as I would have expected.
          // (note that `state` here is actually an Immer Draft<S>, from `createReducer`)
          // One woarkound was to return the new plain result value instead
          // See https://github.com/immerjs/immer/issues/533
          // However, after tweaking `createStateOperator` to check if the argument is a draft,
          // we can just treat the operator as strictly mutating, without returning a result,
          // and the result should be correct.
          const result = adapter.addOne(state, action);
          expect(result.ids.length).toBe(1);
          //Deliberately _don't_ return result
        },
        // We should also be able to pass them individually as case reducers
        addAnother: adapter.addOne,
      },
    });

    const { addOne, addAnother } = booksSlice.actions;

    const store = configureStore({
      reducer: {
        books: booksSlice.reducer,
      },
    });

    const book1: BookModel = { id: "a", title: "First" };
    store.dispatch(addOne(book1));

    const state1 = store.getState();
    expect(state1.books.ids.length).toBe(1);
    expect(state1.books.entities["a"]).toEqual({
      saved: book1,
      changes: { added: true },
    });

    const book2: BookModel = { id: "b", title: "Second" };
    store.dispatch(addAnother(book2));

    const state2 = store.getState();
    expect(state2.books.ids.length).toBe(2);
    expect(state2.books.entities["b"]).toEqual({
      saved: book2,
      changes: { added: true },
    });
  });
});
