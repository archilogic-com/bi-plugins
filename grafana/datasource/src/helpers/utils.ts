export function shuffle(array: string[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function randomIntFromInterval(min = 0, max = 10) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getNodeIdsFromScene(sceneStructure: any) {
  const ids: any = [];
  sceneStructure.children.forEach((obj: any) => {
    obj.children.forEach((child: any) => {
      if (child.type === 'interior' || child.type === 'polyfloor') {
        ids.push(child.id);
      }
    });
  });
  return ids;
}
