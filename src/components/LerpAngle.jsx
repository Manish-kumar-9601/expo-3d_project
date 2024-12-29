const normalizeAngle = (angle) =>
{
    return angle % (2 * Math.PI);
};

export const lerpAngle = (start, end, t) =>
{
    start = normalizeAngle(start);
    end = normalizeAngle(end);

    const diff = end - start;
    const adjustedDiff = (diff > Math.PI) ? diff - 2 * Math.PI : (diff < -Math.PI) ? diff + 2 * Math.PI : diff;

    return normalizeAngle(start + adjustedDiff * t);
};