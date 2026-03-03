class MiniVan {
  calculate(distance, weight) {
    return distance * weight * 3;
  }
}

class Truck {
  calculate(distance, weight) {
    return distance * weight * 2;
  }
}

class Aeroplane {
  calculate(distance, weight) {
    return distance * weight * 1;
  }
}

function getTransportStrategy(distance) {
  if (distance > 500) return new Aeroplane();
  if (distance > 100) return new Truck();
  return new MiniVan();
}

module.exports = {
  getTransportStrategy
};