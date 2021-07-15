from util import entropy, information_gain, partition_classes
import numpy as np 
import ast


class DecisionTree(object):

    class DecisionNode:
        def __init__(self, left, right, decision_function, class_label=None):
            self.left = left
            self.right = right
            self.decision_function = decision_function
            self.class_label = class_label

        def decide(self, feature):
            if self.class_label is not None:
                return self.class_label

            elif self.decision_function(feature):
                return self.left.decide(feature)

            else:
                return self.right.decide(feature)
    def __init__(self):
        # Initializing the tree as an empty dictionary or list, as preferred
        self.tree = None
        self.depth = 7

    def learn(self, X, y):
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree
        
        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a 
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        self.tree = self.__fit_tree__(np.array(X,dtype = int), np.array(y,dtype = int))

    def __fit_tree__(self, X, y, depth = 0):
        if len(np.unique(y)) == 1: #if only one unique class, return that label
            return self.DecisionNode(None, None, None, np.unique(y)[0])
        if len(np.unique(y)) == 0:
            return self.DecisionNode(None, None, None, 0)
        if self.depth < depth:
            counts = [0,0]
            for classtype in y:
                if classtype == 0:
                    counts[0]+=1
                else:
                    counts[1]+=1
            return self.DecisionNode(None, None, None, np.argmax(counts))
        
        m,n = X.shape
        medians = np.median(X,axis=0)
        means = np.mean(X,axis=0)
        q_25 = np.quantile(X,0.25,axis=0)
        q_75 = np.quantile(X,0.75,axis=0)

        best_info_gain = 0.0
        split_attribute, split_val = 0, 0
        best_X_left, best_X_right, best_y_left, best_y_right = None, None, None, None

        #want to minimize Gini_impurity for the current classes
        for i in range(n): # maximising gini_gain is the same as minimizing gini_impurity for current

            X_left, X_right, y_left, y_right = partition_classes(X, y, i, medians[i])
            info_gain = information_gain(y, [y_left, y_right])
            if info_gain > best_info_gain:
                best_info_gain = info_gain
                best_X_left, best_X_right, best_y_left, best_y_right = X_left, X_right, y_left, y_right
                split_attribute, split_val = i, medians[i]

            X_left, X_right, y_left, y_right = partition_classes(X, y, i, means[i])
            info_gain = information_gain(y, [y_left, y_right])
            if info_gain > best_info_gain:
                best_info_gain = info_gain
                best_X_left, best_X_right, best_y_left, best_y_right = X_left, X_right, y_left, y_right
                split_attribute, split_val = i, means[i]

            X_left, X_right, y_left, y_right = partition_classes(X, y, i, q_25[i])
            info_gain = information_gain(y, [y_left, y_right])
            if info_gain > best_info_gain:
                best_info_gain = info_gain
                best_X_left, best_X_right, best_y_left, best_y_right = X_left, X_right, y_left, y_right
                split_attribute, split_val = i, q_25[i]

            X_left, X_right, y_left, y_right = partition_classes(X, y, i, q_75[i])
            info_gain = information_gain(y, [y_left, y_right])
            if info_gain > best_info_gain:
                best_info_gain = info_gain
                best_X_left, best_X_right, best_y_left, best_y_right = X_left, X_right, y_left, y_right
                split_attribute, split_val = i, q_75[i]

        if best_info_gain <= 0:
            counts = [0,0]
            for classtype in classes:
                if classtype == 0:
                    counts[0]+=1
                else:
                    counts[1]+=1
            return self.DecisionNode(None, None, None, np.argmax(counts))
        
        # if type(split_val) is int or split_val.isdigit():
        decision_tree_node = self.DecisionNode(None, None, lambda a:a[split_attribute] <= split_val)
        decision_tree_node.left = self.__fit_tree__(X_left, y_left, depth + 1)
        decision_tree_node.right = self.__fit_tree__(X_right, y_right, depth + 1)
        # else:
            # decision_tree_node = DecisionNode(None, None, lambda a:a[split_attribute] == split_value)
            # decision_tree_node.left = self.__fit_tree__(features[left_idx], classes[left_idx], depth + 1)
            # decision_tree_node.right = self.__fit_tree__(features[right_idx], classes[right_idx], depth + 1)

        return decision_tree_node


    def classify(self, record):
        # TODO: classify the record using self.tree and return the predicted label
        # class_labels = []
        # m,n = record.shape
        # for i in range(m):
        #     # print(self.tree)
        #     class_labels.append(self.tree.decide(features[i]))
        return self.tree.decide(record)
