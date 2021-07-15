import http.client
import json
import time
import timeit
import sys
import collections
from pygexf.gexf import *


#
# implement your data retrieval code here
#
conn = http.client.HTTPSConnection("rebrickable.com")
key=sys.argv[1]

#(a)
conn.request("GET", "/api/v3/lego/sets/?page_size=1000&min_parts=1142&ordering=-num_parts&key="+key)
response = conn.getresponse()
data = response.read()
data = json.loads(data)
sets = data["results"]

#(b) +(c)
file = open("bricks_graph.gexf","wb")
parts_gexf = Gexf("Zhe Min", "HW1")
parts_graph = parts_gexf.addGraph("undirected", "static", "Parts Map")
parts_graph.addNodeAttribute("Type", type = "string")


max_num_parts = 20
i = 0
for set in sets:
    set_num, set_name = set["set_num"], set["name"]
    set_node = parts_graph.addNode(id = set_num, label = set_name, r = "0", g = "0", b = "0")
    set_node.addAttribute(id = "0", value = "set")
    conn.request("GET", "/api/v3/lego/sets/"+str(set_num)+"/parts/?page_size=1000&key="+key)
    response = conn.getresponse()
    data = response.read()
    data = json.loads(data)
    parts = sorted(data["results"], key = lambda i: i["quantity"], reverse = True)[:max_num_parts]
    # print(set_num)
    for part in parts:
        part_rgb = part['color']['rgb']
        part_id = str(part["part"]["part_num"]) + '_' + part_rgb
        part_r, part_g, part_b = tuple(int(part_rgb[i:i+2], 16) for i in (0, 2, 4))
        if not parts_graph.nodeExists(part_id):
            part_node = parts_graph.addNode(id = part_id, label = part['part']['name'], r = str(part_r), g = str(part_g), b = str(part_b))
            part_node.addAttribute(id = "0", value = "part")
        edge = parts_graph.addEdge(id = i, source = set_num, target = part_id, weight = part['quantity'])

        i += 1

    time.sleep(1)

parts_gexf.write(file)
file.close()

# complete auto grader functions for Q1.1.b,d
def min_parts():
    """
    Returns an integer value
    """
    # you must replace this with your own value
    return 1142

def lego_sets():
    """
    return a list of lego sets.
    this may be a list of any type of values
    but each value should represent one set

    e.g.,
    biggest_lego_sets = lego_sets()
    print(len(biggest_lego_sets))
    > 280
    e.g., len(my_sets)
    """
    # you must replace this line and return your own list

    return sets





def gexf_graph():
    """
    return the completed Gexf graph object
    """
    # you must replace these lines and supply your own graph
    return parts_gexf.graphs[0]

# complete auto-grader functions for Q1.2.d

def avg_node_degree():
    """
    hardcode and return the average node degree
    (run the function called “Average Degree”) within Gephi
    """
    # you must replace this value with the avg node degree
    return 5.407

def graph_diameter():
    """
    hardcode and return the diameter of the graph
    (run the function called “Network Diameter”) within Gephi
    """
    # you must replace this value with the graph diameter
    return 8

def avg_path_length():
    """
    hardcode and return the average path length
    (run the function called “Avg. Path Length”) within Gephi
    :return:
    """
    # you must replace this value with the avg path length
    return 4.418