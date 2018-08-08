
  
export const parseWebpackOutput = (data) => {
    console.log('@ parseWebpackOutput', data.chunks[0].modules) 
    const total = {size: 0, factory: 0, building: 0}; 

    const rootData = { "name": "rootData", "children": [] };
    data.chunks[0].modules.forEach(element => {

        let directoryAndName = element.name.replace(/[.\/]/, "");
        let parts = directoryAndName.replace(/[.\/]/, "").split("/");
  
        var currentNode = rootData;
        for (var j = 0; j < parts.length; j++) {
  
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
            // Not yet at the end of the sequence; move down the tree.
            var foundChild = false;
            for (var k = 0; k < children.length; k++) {
              if (children[k]["name"] == nodeName) {
                childNode = children[k];
                foundChild = true;
                break;
              }
            }
            // If we don't already have a child node for this branch, create it.
            if (!foundChild) {
              childNode = { "name": nodeName, "children": [] };
              children.push(childNode);
            }
            currentNode = childNode;
          } else {
            // Reached the end of the sequence; create a leaf node.
            const size = element.size || 0;
            const factory = element.profile ? element.profile.factory : 0;
            const building = element.profile ? element.profile.building : 0;
  
            

            total.size += Number(size);
            total.factory += Number(factory);
            total.building += Number(building);
            childNode = { "name": nodeName, size, factory, building };
            children.push(childNode);
          }
        }
      });

    
    return {hierarchicalData: rootData, total: total};
};

// parse our own custom parcel output. parcel doesn't keep track of factory times.
export const parseParcelOutput = (data) => {
    console.log('@ parseParcelOutput')  
    const total = {size: 0, building: 0}; 
    
    const rootData = { "name": "rootData", "children": [] };
    data.slice().forEach(element => {
        
        let directoryAndName = element.name.replace(/\\/g, "/").replace(/[.\/]/, "");
        console.log(directoryAndName);
        let parts = directoryAndName.replace(/[.\/]/, "").split("/");

        var currentNode = rootData;
        for (var j = 0; j < parts.length; j++) {
  
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
            // Not yet at the end of the sequence; move down the tree.
            var foundChild = false;
            for (var k = 0; k < children.length; k++) {
              if (children[k]["name"] == nodeName) {
                childNode = children[k];
                foundChild = true;
                break;
              }
            }
            // If we don't already have a child node for this branch, create it.
            if (!foundChild) {
              childNode = { "name": nodeName, "children": [] };
              children.push(childNode);
            }
            currentNode = childNode;
          } else {
            // Reached the end of the sequence; create a leaf node.
            const size = element.bundledSize || 0;
            const building = element.buildTime;
            
            total.size += Number(size);
            total.building += Number(building);
            childNode = { "name": nodeName, size, building };
            children.push(childNode);
          }
        }
      });

    
    return {hierarchicalData: rootData, total: total};
};


export const parseRollupOutput = (data) => {
    console.log('@ parseRollupOutput')  
    return data
};
