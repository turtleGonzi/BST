class Node {
  constructor(data) {
    this.data = data;
  }
  leftChild = null;
  rightChild = null;
}

class Tree {
  constructor(array) {
    this.array = array;
  }

  root;

  sortArray = function (array = this.array) {
    if (array.length === 1) {
      return array;
    }
    const leftArray = this.sortArray(
      array.splice(0, Math.floor(array.length / 2))
    );
    const rightArray = this.sortArray(
      array.splice(0, Math.floor(array.length))
    );

    const merged = [];
    while (leftArray.length || rightArray.length) {
      if (leftArray[0] < rightArray[0] || !rightArray[0]) {
        merged.push(leftArray[0]);
        leftArray.shift();
      } else {
        merged.push(rightArray[0]);
        rightArray.shift();
      }
    }
    return merged;
  };

  removeArrayDuplic = function (array) {
    const arrNoDuplic = [];
    for (const item of array) {
      if (!arrNoDuplic.includes(item)) {
        arrNoDuplic.push(item);
      }
    }
    return arrNoDuplic;
  };

  buildTree = function () {
    const arr = this.removeArrayDuplic(this.sortArray());

    const tree = function (arr, minIndex, maxIndex) {
      if (minIndex > maxIndex) {
        return null;
      }
      const mid = Math.floor((minIndex + maxIndex) / 2);
      const root = new Node(arr[mid]);
      if (root.data == undefined) {
        return null;
      }
      root.leftChild = tree(arr, minIndex, mid - 1);
      root.rightChild = tree(arr, mid + 1, maxIndex);

      return root;
    };
    this.root = tree(arr, 0, arr.length);
  };

  prettyPrint = (node = this.root, prefix = "", isLeft = true) => {
    if (node === null || node === undefined) {
      return;
    }

    this.prettyPrint(
      node.rightChild,
      `${prefix}${isLeft ? "│   " : "    "}`,
      false
    );
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    this.prettyPrint(
      node.leftChild,
      `${prefix}${isLeft ? "    " : "│   "}`,
      true
    );
  };

  includes(value) {
    const recur = function (node) {
      if (!node) {
        return;
      } else if (node.data === value) {
        return true;
      }
      const resultLeft = recur(node.leftChild);
      if (resultLeft) {
        return true;
      }
      const resultRight = recur(node.rightChild);
      if (resultRight) {
        return true;
      }
      return false;
    };
    return recur(this.root);
  }

  insert(value) {
    const recur = function (node) {
      if (node?.data === value) {
        return;
      }

      if (node.data > value) {
        if (!node.leftChild) {
          node.leftChild = new Node(value);
          return;
        } else {
          recur(node.leftChild);
        }
      } else {
        if (!node.rightChild) {
          node.rightChild = new Node(value);
          return;
        } else {
          recur(node.rightChild);
        }
      }
    };
    recur(this.root);
  }

  deleteItem(value) {
    const findRight = function (node) {
      let current = node.rightChild;
      let prev = node;
      while (current.leftChild) {
        prev = current;
        current = current.leftChild;
      }
      if (prev.leftChild === current) {
        prev.leftChild = null;
      }
      return current;
    };

    const deleteNode = function (node, previous) {
      if (!node.leftChild && !node.rightChild) {
        if (previous.leftChild?.data === value) {
          previous.leftChild = null;
        } else if (previous.rightChild?.data === value) {
          previous.rightChild = null;
        }
        return;
      }
      const item = findRight(node);
      if (item !== node.leftChild) {
        item.leftChild = node.leftChild;
      } else {
        item.leftChild = node.leftChild?.leftChild;
      }
      if (item !== node.rightChild) {
        item.rightChild = node.rightChild;
      } else {
        item.rightChild = node.rightChild?.rightChild;
      }

      if (previous.leftChild?.data === value) {
        previous.leftChild = item;
      } else if (previous.rightChild?.data === value) {
        previous.rightChild = item;
      }
      return;
    };
    const findNode = function (node, previous) {
      if (!node) {
        return;
      }
      if (node.data === value) {
        return deleteNode(node, previous);
      }
      let result;
      if (node.data < value || (!node.leftChild && node.rightChild)) {
        result = findNode(node.rightChild, node);
      } else {
        result = findNode(node.leftChild, node);
      }
    };
    return findNode(this.root);
  }

  levelOrderForEach(callback) {
    const list = [this.root];
    let i = 0;
    while (list[i]) {
      try {
        callback(list[i].data);
      } catch (e) {
        console.log("callback is required");
      }
      if (list[i].leftChild) {
        list.push(list[i].leftChild);
      }
      if (list[i].rightChild) {
        list.push(list[i].rightChild);
      }
      i++;
    }
  }

  levelOrderForEachRecursion(callback) {
    const recur = function (nodes, i = 0) {
      if (!nodes[i]) {
        return;
      }
      callback(nodes[i].data);
      if (nodes[i].leftChild) {
        nodes.push(nodes[i].leftChild);
      }
      if (nodes[i].rightChild) {
        nodes.push(nodes[i].rightChild);
      }
      recur(nodes, ++i);
    };
    recur([this.root]);
  }

  preOrderForEach(callback) {
    const recur = function (node) {
      if (!node) {
        return;
      }
      try {
        callback(node.data);
      } catch (e) {
        console.log(e);
      }
      recur(node.leftChild);
      recur(node.rightChild);
    };
    recur(this.root);
  }

  inOrderForEach(callback) {
    const recur = function (node) {
      if (!node) {
        return;
      }
      recur(node.leftChild);
      try {
        callback(node.data);
      } catch (e) {
        console.log(e);
      }
      recur(node.rightChild);
    };
    recur(this.root);
  }

  postOrderForEach(callback) {
    const recur = function (node) {
      if (!node) {
        return;
      }
      recur(node.leftChild);
      recur(node.rightChild);
      try {
        callback(node.data);
      } catch (e) {
        console.log(e);
      }
    };
    recur(this.root);
  }

  height(value) {
    const findNode = () => {
      let node = this.root;
      while (node) {
        if (node.data === value) {
          return node;
        }
        if (node.data < value) {
          node = node.rightChild;
        } else {
          node = node.leftChild;
        }
      }
      return undefined;
    };
    const findHeigth = function (node) {
      if (!node) {
        return;
      }
      if (!node.leftChild && !node.rightChild) {
        return 0;
      }
      let left = findHeigth(node.leftChild);
      let right = findHeigth(node.rightChild);
      return left > right ? ++left : ++right;
    };
    const node = findNode();
    return findHeigth(node);
  }

  depth(value) {
    let node = this.root;
    let count = 0;
    while (node) {
      if (node.data === value) {
        return count;
      }
      count++;
      if (node.data < value) {
        node = node.rightChild;
      } else {
        node = node.leftChild;
      }
    }
    return undefined;
  }

  isBalanced() {
    const heigth = (node, iter = 0) => {
      if (!node) {
        return iter;
      }
      iter++;
      let left = heigth(node.leftChild, iter);
      let right = heigth(node.rightChild, iter);
      return left > right ? left : right;
    };
    const compare = (node) => {
      if (!node) {
        return true;
      }
      let left = heigth(node.leftChild);
      let right = heigth(node.rightChild);
      const difference = Math.abs(left - right);
      let leftRes = compare(node.leftChild);
      let rightRes = compare(node.rightChild);
      if (!leftRes || !rightRes) {
        return false;
      }
      if (difference <= 1) {
        return true;
      } else {
        return false;
      }
    };
    return compare(this.root);
  }

  reblance() {
    const list = [];
    this.inOrderForEach((e) => {
      list.push(e);
    });
    this.array = list;
    this.buildTree();
  }
}

const randomNum = function () {
  return Math.floor(Math.random() * 100);
};

const arr = [];
for (let i = 0; i < 20; i++) {
  arr.push(randomNum());
}

const tree = new Tree(arr);
// const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
console.log(tree.buildTree());
console.log(tree.prettyPrint());

tree.levelOrderForEach((e) => console.log(e));
console.log("---------PREORDER-----------");
tree.preOrderForEach((e) => console.log(e));
console.log("---------INORDER-----------");
tree.inOrderForEach((e) => console.log(e));
console.log("---------POSTORDER-----------");
tree.postOrderForEach((e) => console.log(e));
tree.levelOrderForEachRecursion((e) => console.log(e));
console.log(tree.isBalanced());

console.log(tree.insert(101));
console.log(tree.insert(120));
console.log(tree.insert(125));
console.log(tree.insert(130));

console.log(tree.prettyPrint());
console.log(tree.isBalanced());
console.log(tree.reblance());
console.log(tree.isBalanced());
console.log(tree.prettyPrint());

tree.levelOrderForEach((e) => console.log(e));
console.log("---------PREORDER-----------");
tree.preOrderForEach((e) => console.log(e));
console.log("---------INORDER-----------");
tree.inOrderForEach((e) => console.log(e));
console.log("---------POSTORDER-----------");
tree.postOrderForEach((e) => console.log(e));
tree.levelOrderForEachRecursion((e) => console.log(e));

// const tree = new Tree(arr);

// console.log(tree.buildTree());
// console.log(tree.prettyPrint());

// tree.levelOrderForEach((e) => console.log(e));
// console.log(tree.levelOrderForEach());
// console.log("---------PREORDER-----------");
// tree.preOrderForEach((e) => console.log(e));
// console.log("---------INORDER-----------");
// tree.inOrderForEach((e) => console.log(e));
// console.log("---------POSTORDER-----------");
// tree.postOrderForEach((e) => console.log(e));
// tree.levelOrderForEachRecursion((e) => console.log(e));
// console.log(tree.isBalanced());

/*
console.log(tree.deleteItem(67));
console.log(tree.prettyPrint());
console.log(tree.deleteItem(324));
console.log(tree.includes(67));
// console.log(tree.insert(10));
// console.log(tree.prettyPrint());
console.log(tree);
// console.log(tree.deleteItem(67));
console.log(tree);
console.log(tree.prettyPrint());
console.log("--------------------");
tree.levelOrderForEach((e) => console.log(e));
console.log(tree.levelOrderForEach());
tree.levelOrderForEachRecursion((e) => console.log(e));
console.log("---------PREORDER-----------");
tree.preOrderForEach((e) => console.log(e));
console.log("---------INORDER-----------");
tree.inOrderForEach((e) => console.log(e));
console.log("---------POSTORDER-----------");
tree.postOrderForEach((e) => console.log(e));
console.log("---------HEIGHT-----------");
console.log(tree.height(4));
console.log("---------DEPTH-----------");
console.log(tree.depth(4));
console.log("---------BALANCED-----------");
console.log(tree.isBalanced());
console.log("---------ISBALANCED-----------");
tree.reblance();
console.log(tree.prettyPrint());
*/
