import React from 'react';
import { offenses, chapters } from '../data/offenses';
import { OffenseWithModifiers } from '../types';

interface OffensesTableProps {
    selectedOffenses: OffenseWithModifiers[];
    toggleOffense: (code: string) => void;
}

const OffensesTable: React.FC<OffensesTableProps> = ({ selectedOffenses, toggleOffense }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="bg-gray-800 p-2" rowSpan={2}>Раздел</th>
                    <th className="bg-gray-800 p-2" rowSpan={2}>Глава</th>
                    <th className="bg-gray-800 p-2" colSpan={6}>Статьи</th>
                </tr>
                <tr>
                    <th className="bg-green-800 p-2">XX1<br />Незначительные правонарушения</th>
                    <th className="bg-yellow-800 p-2">XX2<br />Легкие правонарушения</th>
                    <th className="bg-orange-800 p-2">XX3<br />Средние правонарушения</th>
                    <th className="bg-red-800 p-2">XX4<br />Тяжкие правонарушения</th>
                    <th className="bg-red-900 p-2">XX5<br />Особо тяжкие правонарушения</th>
                    <th className="bg-black p-2">XX6<br />Критические правонарушения</th>
                </tr>
                </thead>
                <tbody>
                {chapters.map((section) =>
                    section.chapters.map((chapter, idx) => {
                        const chapterOffenses = offenses.filter((o) => o.chapter === chapter);
                        return (
                            <tr key={chapter}>
                                {idx === 0 && (
                                    <th className="bg-gray-800 p-2" rowSpan={section.chapters.length}>
                                        {section.section}
                                    </th>
                                )}
                                <th className="bg-gray-800 p-2">{chapter}</th>
                                {['XX1', 'XX2', 'XX3', 'XX4', 'XX5', 'XX6'].map((severity) => {
                                    const offense = chapterOffenses.find((o) => o.severity === severity);
                                    const isSelected = offense && selectedOffenses.some((o) => o.code === offense.code);
                                    return (
                                        <td
                                            key={severity}
                                            className={`p-2 cursor-pointer border border-gray-700 ${
                                                isSelected
                                                    ? 'bg-amber-500'
                                                    : severity === 'XX1'
                                                        ? 'bg-green-800'
                                                        : severity === 'XX2'
                                                            ? 'bg-yellow-800'
                                                            : severity === 'XX3'
                                                                ? 'bg-orange-800'
                                                                : severity === 'XX4'
                                                                    ? 'bg-red-800'
                                                                    : severity === 'XX5'
                                                                        ? 'bg-red-900'
                                                                        : 'bg-black'
                                            }`}
                                            onClick={() => {
                                                if (offense) {
                                                    toggleOffense(offense.code);
                                                }
                                            }}
                                        >
                                            {offense ? (
                                                <span className="tooltip relative">
                                                        <i>{offense.title}</i>
                                                        <span className="tooltiptext">
                                                            <b>{offense.code}</b><br />
                                                            {offense.description}
                                                        </span>
                                                    </span>
                                            ) : ''}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OffensesTable;