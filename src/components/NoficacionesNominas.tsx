import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileDown, Briefcase, Users, DollarSign, Calculator } from 'lucide-react';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

interface EmployeePreset {
  id: string;
  nombre: string;
  puesto: string;
  salarioBruto: number;
}

export default function NoficacionesNominas() {
  const [employees, setEmployees] = useState<EmployeePreset[]>([
    { id: '1', nombre: 'Carlos Manuel Gómez', puesto: 'Coordinador de Almacén', salarioBruto: 32000 },
    { id: '2', nombre: 'Ana Mercedes Almonte', puesto: 'Especialista de Tesorería', salarioBruto: 55000 },
    { id: '3', nombre: 'José Luis Tavárez', puesto: 'Director Comercial', salarioBruto: 110000 },
  ]);

  const [newName, setNewName] = useState('');
  const [newPuesto, setNewPuesto] = useState('Desarrollador Junior');
  const [newSalario, setNewSalario] = useState('25000');

  const [payrollStats, setPayrollStats] = useState<any>(null);

  useEffect(() => {
    let totalGross = 0;
    let totalAFP_Employee = 0;
    let totalSFS_Employee = 0;
    let totalISR = 0;
    let totalNet = 0;

    // Employer shares
    let totalAFP_Employer = 0;
    let totalSFS_Employer = 0;
    let totalARL = 0;

    employees.forEach(emp => {
      const netCalc = calcularSalarioNeto({ salarioBruto: emp.salarioBruto.toString(), ingresosAdicionales: '0' });
      totalGross += emp.salarioBruto;
      totalAFP_Employee += netCalc.afp;
      totalSFS_Employee += netCalc.sfs;
      totalISR += netCalc.isr;
      totalNet += netCalc.salarioNeto;

      // Employer calculations
      const salarioMinimoGrande = 24150;
      const topeAFP = salarioMinimoGrande * 20; // 483,000
      const topeSFS = salarioMinimoGrande * 10; // 241,500
      const topeARL = salarioMinimoGrande * 4;  // 96,600

      totalAFP_Employer += Math.min(emp.salarioBruto, topeAFP) * 0.0710;
      totalSFS_Employer += Math.min(emp.salarioBruto, topeSFS) * 0.0709;
      totalARL += Math.min(emp.salarioBruto, topeARL) * 0.012; // 1.2% promedio
    });

    setPayrollStats({
      totalGross,
      totalAFP_Employee,
      totalSFS_Employee,
      totalISR,
      totalNet,
      totalAFP_Employer,
      totalSFS_Employer,
      totalARL,
      totalEmployerCost: totalGross + totalAFP_Employer + totalSFS_Employer + totalARL
    });
  }, [employees]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSalario) return;

    setEmployees(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        nombre: newName,
        puesto: newPuesto,
        salarioBruto: parseFloat(newSalario) || 0
      }
    ]);

    setNewName('');
    setNewPuesto('Gerente Adjunto');
    setNewSalario('45000');
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // Mock export xls
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nombre,Puesto,Salario Bruto,AFP Descuento,SFS Descuento,ISR Retenido,Salario Neto\n";
    
    employees.forEach(emp => {
      const netCalc = calcularSalarioNeto({ salarioBruto: emp.salarioBruto.toString(), ingresosAdicionales: '0' });
      csvContent += `"${emp.nombre}","${emp.puesto}",${emp.salarioBruto},${netCalc.afp.toFixed(2)},${netCalc.sfs.toFixed(2)},${netCalc.isr.toFixed(2)},${netCalc.salarioNeto.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sueldofacil_nomina_republica_dominicana.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* CARD IZQUIERDA: GESTIÓN DE COLABORADORES */}
      <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
              Calculador de Nómina Colectiva
            </h2>
            <p className="text-xs text-slate-500 mt-1">Simula la nómina de tus empleados sumando sueldos y obteniendo retenciones globales consolidadas.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 border border-slate-200 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0 print:hidden"
          >
            <FileDown className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        {/* INPUT DE NUEVO TRABAJADOR */}
        <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end bg-slate-50 p-4 border border-slate-200 rounded-xl print:hidden">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1.5">Nombre Completo</label>
            <input
              type="text"
              placeholder="Ej: Marcos Almonte"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1.5">Puesto / Cargo</label>
            <input
              type="text"
              placeholder="Ej: Auxiliar RRHH"
              value={newPuesto}
              onChange={e => setNewPuesto(e.target.value)}
              className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1.5">Sueldo Bruto RD$</label>
            <input
              type="number"
              placeholder="Ej: 30000"
              value={newSalario}
              onChange={e => setNewSalario(e.target.value)}
              className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              required
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-2 rounded-lg flex items-center justify-center cursor-pointer transition-all text-xs shadow"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* LISTADO GRID */}
        <div className="overflow-x-auto border border-slate-150 rounded-xl">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-150 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Empleado / Puesto</th>
                <th className="p-3 text-right">Sueldo Bruto</th>
                <th className="p-3 text-right">AFP Desc.</th>
                <th className="p-3 text-right">SFS Desc.</th>
                <th className="p-3 text-right">ISR Retenido</th>
                <th className="p-3 text-right">Salario Neto</th>
                <th className="p-3 text-center print:hidden">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const netObj = calcularSalarioNeto({ salarioBruto: emp.salarioBruto.toString(), ingresosAdicionales: '0' });
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{emp.nombre}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{emp.puesto}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-medium">RD$ {emp.salarioBruto.toLocaleString('en-US')}</td>
                    <td className="p-3 text-right font-mono text-rose-500">-RD$ {netObj.afp.toFixed(0)}</td>
                    <td className="p-3 text-right font-mono text-rose-500">-RD$ {netObj.sfs.toFixed(0)}</td>
                    <td className="p-3 text-right font-mono text-rose-500">-RD$ {netObj.isr.toFixed(0)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">RD$ {netObj.salarioNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                    <td className="p-3 text-center print:hidden">
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="text-slate-400 hover:text-red-650 p-1 rounded hover:bg-red-50/50 cursor-pointer transition-all"
                        title="Eliminar de la lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-405 font-medium">
                    No has agregado ningún empleado a la nómina del departamento. Utiliza el formulario superior.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ESPACIO ANUNCIO RESPONSIVO NO INTRUSIVO */}
        <AdsenseMock slot="nominas-list-bottom" type="banner" />
      </div>

      {/* CARD DERECHA: CONSOLIDADO DE NOMINA Y APORTES EMPRESA */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6 self-stretch min-h-[450px] flex flex-col justify-between">
        {payrollStats && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Consolidado Financiero
              </span>
              <div className="bg-blue-950 text-blue-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-blue-800 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {employees.length} Colaboradores
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-medium">Costo Total Mensual del Empleador</p>
              <h3 className="text-3xl font-bold text-white tracking-tight mt-1">
                RD$ {payrollStats.totalEmployerCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                De los cuales RD$ {payrollStats.totalNet.toLocaleString('en-US', { maximumFractionDigits: 0 })} van directos al bolsillo neto de los trabajadores.
              </p>
            </div>

            {/* RETENCIONES DE NOMINA GLOBALES */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Aportes Retenidos a Empleados (TSS/DGII)</p>
              
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>AFP Total Descontado</span>
                <span className="font-mono text-rose-400">-RD$ {payrollStats.totalAFP_Employee.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>SFS Total Descontado</span>
                <span className="font-mono text-rose-400">-RD$ {payrollStats.totalSFS_Employee.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>ISR Total Retenido (DGII)</span>
                <span className="font-mono text-rose-400">-RD$ {payrollStats.totalISR.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>

              {/* CARGA SOCIAL PATRONAL RELEVANTE */}
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pt-3 border-t border-slate-800">Aportaciones Patronales Adicionales</p>

              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>AFP Seguridad Social (7.10%)</span>
                <span className="font-mono text-slate-200">+RD$ {payrollStats.totalAFP_Employer.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>SFS Seguridad Social (7.09%)</span>
                <span className="font-mono text-slate-200">+RD$ {payrollStats.totalSFS_Employer.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>Riesgos Laborales (ARL ~1.2%)</span>
                <span className="font-mono text-slate-200">+RD$ {payrollStats.totalARL.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => window.print()}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
          >
            Imprimir Plan de Nómina Mensual
          </button>
        </div>
      </div>
    </div>
  );
}
