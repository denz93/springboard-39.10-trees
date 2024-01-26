/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  /**
   * 
   * @param {BinaryTreeNode} root 
   */
  constructor(root = null) {
    /**
     * @type {BinaryTreeNode}
     */
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    if (this.root === null) return 0;
    function findMin(node, depth) {
      if (!node) return depth;
      if (!node.left && !node.right) return depth;
      if (!node.left) return findMin(node.right, depth + 1);
      if (!node.right) return findMin(node.left, depth + 1);

      return Math.min(findMin(node.left, depth + 1), findMin(node.right, depth + 1))
    }

    return findMin(this.root, 1)
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    if (this.root === null) return 0;

    function findMax(node, depth) {
      if (!node) return depth;
      if (!node.left && !node.right) return depth;
      if (!node.left) return findMax(node.right, depth + 1);
      if (!node.right) return findMax(node.left, depth + 1);

      return Math.max(findMax(node.left, depth + 1), findMax(node.right, depth + 1))
    }
    return findMax(this.root, 1)
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    if (this.root === null) return 0

    /**
     * @type {Map<BinaryTreeNode, BinaryTreeNode[]>}
     */
    const neighborMap = new Map();
    const stack = [this.root]
    while (stack.length > 0) {
      let node = stack.pop()
      if (node.left) {
        !neighborMap.has(node) && neighborMap.set(node, []);
        !neighborMap.has(node.left) && neighborMap.set(node.left, []);

        neighborMap.get(node).push(node.left)
        neighborMap.get(node.left).push(node)
        stack.push(node.left)
      }
      if (node.right) {
        !neighborMap.has(node) && neighborMap.set(node, []);
        !neighborMap.has(node.right) && neighborMap.set(node.right, []);
        neighborMap.get(node).push(node.right)
        neighborMap.get(node.right).push(node)
        stack.push(node.right)
      }
    }
    /**
     * 
     * @param {BinaryTreeNode} node 
     * @param {Set<BinaryTreeNode>} visited 
     */
    function findMaxSum(node, visited) {
      if (visited.has(node)) return 0
      visited.add(node)
      const neighbors = neighborMap.get(node) || [];
      if (neighbors.length === 0) return node.val 

      return Math.max(...neighbors.map(neighbor => findMaxSum(neighbor, visited) + node.val))
    }
    return Math.max(...[...neighborMap.keys()].map(node => findMaxSum(node, new Set())))
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    if (this.root === null) return null

    function findMin(node, min) {
      if (node.val <= lowerBound) return min
      const newMin = min === null || node.val < min ? node.val : min
      if (!node.left && !node.right) return newMin
      return Math.min(findMin(node.left, newMin), findMin(node.right, newMin))
    }
    return findMin(this.root, null)
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {
    let stack = [this.root]
    while (stack.length > 0) {
      if (stack.indexOf(node1) >= 0 && stack.indexOf(node2) >= 0) return true;
      if (stack.indexOf(node1) >= 0 || stack.indexOf(node2) >= 0) return false;
      const newStack = []
      for (const node of stack) {
        const children = []
        if (node.left) children.push(node.left)
        if (node.right) children.push(node.right)
        if (children.indexOf(node1) >= 0 && children.indexOf(node2) >= 0) return false;
        newStack.push(...children)
      }
      stack = newStack
    }
    return false
  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize(tree) {
    function toTokens(node) {
      if (!node) return null
      return {
        val: node.val,
        left: toTokens(node.left),
        right: toTokens(node.right)
      }
    }
    const str = JSON.stringify(toTokens(tree.root))
    return str
  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */
  /**
   * 
   * @param {string} str 
   * @returns 
   */
  static deserialize(str) {
    const obj = JSON.parse(str);
    function fromObject(obj) {
      if (!obj) return null
      return new BinaryTreeNode(obj.val, fromObject(obj.left), fromObject(obj.right))
    }
    const root = fromObject(obj)
    return new BinaryTree(root)
  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    const parentMap = new Map();
    const stack = [this.root]
    while (stack.length > 0) {
      const node = stack.pop();
      if (node.left) {
        parentMap.set(node.left, node)
        stack.push(node.left)
      }
      if (node.right) {
        parentMap.set(node.right, node)
        stack.push(node.right)
      }
    }
    let parents1 = []
    let p = node1
    while (p) {
      parents1.push(p)
      p = parentMap.get(p)
    }
    p = node2
    while (p) {
      if (parents1.indexOf(p) >= 0) return p
      p = parentMap.get(p)
    }
    return null
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
