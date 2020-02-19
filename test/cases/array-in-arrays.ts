import { createArray, createDocument, position } from "../types";

const doc = createDocument;
const array = createArray;

const ast = doc(
  array(
    [
      array(
        [
          array(
            [
              array(
                [
                  array(
                    [
                      array(
                        [array([array([], position(1, 8, 7, 1, 10, 9))], position(1, 7, 6, 1, 11, 10))],
                        position(1, 6, 5, 1, 12, 11),
                      ),
                    ],
                    position(1, 5, 4, 1, 13, 12),
                  ),
                ],
                position(1, 4, 3, 1, 14, 13),
              ),
            ],
            position(1, 3, 2, 1, 15, 14),
          ),
        ],
        position(1, 2, 1, 1, 16, 15),
      ),
    ],
    position(1, 1, 0, 1, 17, 16),
  ),
);

export = {
  ast: ast,
  options: {
    verbose: true,
  },
};
