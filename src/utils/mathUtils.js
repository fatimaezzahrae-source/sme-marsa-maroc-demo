// Fonctions utilitaires de calcul électrotechnique et formatage

export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return Number(num).toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0,00 DH';
  return `${Number(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} DH`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatTimeOnly = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Modbus TCP/IP Frame Generator (Hex representation for SCADA debugging console)
export const generateModbusFrameHex = (transId, unitId, funcCode, startReg, regCount) => {
  const transHex = transId.toString(16).padStart(4, '0').toUpperCase();
  const protoHex = '0000'; // Modbus TCP
  const lenHex = '0006';  // Length 6 bytes following
  const unitHex = unitId.toString(16).padStart(2, '0').toUpperCase();
  const funcHex = funcCode.toString(16).padStart(2, '0').toUpperCase();
  const regHex = startReg.toString(16).padStart(4, '0').toUpperCase();
  const countHex = regCount.toString(16).padStart(4, '0').toUpperCase();

  return `${transHex} ${protoHex} ${lenHex} ${unitHex} ${funcHex} ${regHex} ${countHex}`;
};

// Modbus TCP Response Frame Simulator with Float32 IEEE 754 payload
export const generateModbusResponseHex = (transId, unitId, funcCode, floatVal) => {
  const transHex = transId.toString(16).padStart(4, '0').toUpperCase();
  const protoHex = '0000';
  const lenHex = '0007'; // 1 (unit) + 1 (func) + 1 (byte count) + 4 (data)
  const unitHex = unitId.toString(16).padStart(2, '0').toUpperCase();
  const funcHex = funcCode.toString(16).padStart(2, '0').toUpperCase();
  const byteCount = '04';

  // Float to Hex IEEE 754
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, floatVal, false); // Big endian
  let dataHex = '';
  for (let i = 0; i < 4; i++) {
    dataHex += view.getUint8(i).toString(16).padStart(2, '0').toUpperCase() + ' ';
  }

  return `${transHex} ${protoHex} ${lenHex} ${unitHex} ${funcHex} ${byteCount} ${dataHex.trim()}`;
};
