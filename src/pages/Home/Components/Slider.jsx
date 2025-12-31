import React, { useState, useEffect, useCallback } from 'react'
import supabase from '../../../../supabase'
function Slider() {
  const [logos, setLogos] = useState([]);

  const getcustomers = useCallback(async () => {
    const { data, error } = await supabase.from("customers").select("*");
    if (error) throw error;
    setLogos(data ?? []);
  }, []);

  useEffect(() => {
    getcustomers().catch((e) => alert(e?.message ?? String(e)));
  }, [getcustomers]);

  useEffect(() => {
    const channel = supabase
      .channel("customers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        () => {
          console.log("customers changed -> refetch");
          getcustomers().catch((e) => console.log("refetch error", e));
        }
      )
      .subscribe((status) => console.log("realtime status:", status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getcustomers]);

  return (
    <>
      {logos.length >= 8 && (
        <div className="mx-auto h-fit relative overflow-hidden">
          <div className="mx-auto mt-20 h-[100px] relative overflow-hidden">
            <style>{`
        @keyframes scrollLeft {
          to { left: -200px; }
        }
        
      `}</style>

            <div className="wrapper">
              {logos.map((user, i) => (
                <div key={user.namec} className="absolute w-[100px] h-[60px] rounded-md flex flex-col " style={{ left: 'max(calc(200px * 8), 100%)', animation: 'scrollLeft 40s linear infinite', animationDelay: `calc(40s / 8 * (8 - ${i + 1}) * -1)` }} >
                  <h1 className="font-medium text-xs mb-3 bg-white px-2 py-1 rounded inline-block">{user.namec}</h1>
                  <img src={user.image_url} className=" w-full h-full object-cover object-center rounded-xl block" alt={user.namec} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default Slider