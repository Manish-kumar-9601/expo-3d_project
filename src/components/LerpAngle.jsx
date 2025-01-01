const normalizeAngle = (angle) => {
    return angle % (2 * Math.PI);
};

export const lerpAngle = (start, end, t) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    let diff = end - start;
    if (diff > Math.PI) {
        diff -= 2 * Math.PI;
    } else if (diff < -Math.PI) {
        diff += 2 * Math.PI;
    }

    return normalizeAngle(start + diff * t);
};
